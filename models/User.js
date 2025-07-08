import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
     type: String,
     unique: true,
      required:true
     },
  password: {
    type:String,
    required:true,
  }, // hashed or plain initially
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'],
    default: 'user'
  },
  phoneNo:{
    type:String,
 
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
