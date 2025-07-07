import mongoose from 'mongoose';

const traceLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  action: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  byRole: String,
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.TraceLog || mongoose.model('TraceLog', traceLogSchema);
