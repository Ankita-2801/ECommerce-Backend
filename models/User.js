import mongoose from 'mongoose';
import { connectUserDB } from '../config/db.js';

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {type: String, required: false},
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

let User;

export const getUserModel = async () => {
  if (!User) {
    const userDB = await connectUserDB();
    User = userDB.model('User', userSchema);
  }
  return User;
};