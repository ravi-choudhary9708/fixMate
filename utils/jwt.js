import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET 

export function signJWT(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("❌ JWT verification failed (JOSE):", err.message);
    return null;
  }
}
