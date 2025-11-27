import mongoose from 'mongoose';
import { connectAdminDB } from '../config/db.js';

const adminSchema = new mongoose.Schema({
  role: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

let Admin;

export const getAdminModel = async () => {
  if (!Admin) {
    const adminDB = await connectAdminDB();
    Admin = adminDB.model('Admin', adminSchema);
  }
  return Admin;
};