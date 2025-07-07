import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true,
  },
  description: String,
  category: String, // 'hardware', 'software', etc.
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },       // creator
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // staff
  comments: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String,
      message: String,
      time: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
