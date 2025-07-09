import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to list available models (for debugging)
async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:', models.map(m => m.name));
    return models;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable = error.message.includes('overloaded') || 
                          error.message.includes('503') ||
                          error.message.includes('RATE_LIMIT_EXCEEDED');
      
      if (i === maxRetries - 1 || !isRetryable) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(request) {
  console.log('🚀 Gemini API with correct models called');
  
  try {
    const { message } = await request.json();
    console.log('📝 Message received:', message);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is missing');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // List available models for debugging (optional)
    // await listAvailableModels();

    console.log('🌐 Making request to Gemini with correct models...');

    // Try models in order of preference (UPDATED WORKING MODELS)
    const models = [
      "gemini-1.5-flash",      // Fast and free
      "gemini-1.5-pro",        // Higher quality
      "gemini-1.0-pro",        // Legacy but stable
    ];

    let botResponse = null;
    let lastError = null;
    let usedModel = null;

    for (const modelName of models) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        // Use retry logic
        const result = await retryWithBackoff(async () => {
          return await model.generateContent(message);
        });

        const response = await result.response;
        botResponse = response.text();
        usedModel = modelName;
        
        console.log(`✅ Success with model: ${modelName}`);
        break;
        
      } catch (error) {
        console.log(`❌ Failed with model ${modelName}:`, error.message);
        lastError = error;
        
        // If it's a 404 (model not found), try next model
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log(`⚠️ Model ${modelName} not found, trying next...`);
          continue;
        }
        
        // If it's a quota or auth error, don't try other models
        if (error.message.includes('QUOTA_EXCEEDED') || 
            error.message.includes('API_KEY_INVALID')) {
          break;
        }
        
        // Continue to next model for other errors
        continue;
      }
    }

    // If all models failed
    if (!botResponse) {
      console.error('❌ All models failed:', lastError?.message);
      
      // Handle specific error cases
      if (lastError?.message.includes('404') || lastError?.message.includes('not found')) {
        return NextResponse.json({
          response: "I'm currently unavailable due to model configuration issues. Please try again later.",
          error: "All models returned 404 - models may have been deprecated",
          suggestion: "Check Google AI Studio for current model names"
        });
      }
      
      if (lastError?.message.includes('overloaded') || lastError?.message.includes('503')) {
        return NextResponse.json({
          response: "I'm currently experiencing high traffic. Please try again in a few moments!",
          retry: true,
          retryAfter: 30000
        });
      }
      
      if (lastError?.message.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json({
          response: "Daily quota exceeded. Please try again tomorrow.",
          quotaExceeded: true
        });
      }
      
      if (lastError?.message.includes('RATE_LIMIT_EXCEEDED')) {
        return NextResponse.json({
          response: "Rate limit exceeded. Please wait a moment and try again.",
          retry: true,
          retryAfter: 60000
        });
      }
      
      return NextResponse.json(
        { error: `All models failed: ${lastError?.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Final response:', botResponse);
    console.log('🎯 Used model:', usedModel);
    
    return NextResponse.json({ 
      response: botResponse,
      model: usedModel
    });

  } catch (error) {
    console.error('💥 Gemini API Error:', error);
    
    return NextResponse.json(
      { error: `Gemini error: ${error.message}` },
      { status: 500 }
    );
  }
}