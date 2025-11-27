import Joi from "joi";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { getAdminModel } from '../models/Admin.js';
import { getUserModel } from '../models/User.js';
 

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().valid("user", "admin").required()
      .messages({
        "any.only": "Role must be either 'user' or 'admin'",
        "any.required": "Role is required"
      }),
    
    username: Joi.string().min(3).max(100).required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 100 characters"
      }),

    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
      .messages({
        "string.empty": "Phone number is required",
        "string.length": "Phone number must be exactly 10 digits",
        "string.pattern.base": "Phone number must contain only digits"
      }),

    email: Joi.string().email().required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address"
      }),

    password: Joi.string().min(8).max(20).required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must contain at least 8 characters",
        "string.max": "Password cannot exceed 20 characters"
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
};


export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().valid("user", "admin").required()
      .messages({
        "any.only": "Role must be either 'user' or 'admin'",
        "any.required": "Role is required"
      }),
    email: Joi.string().email().required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address"
      }),
    password: Joi.string().min(8).max(20).required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must contain at least 8 characters",
        "string.max": "Password cannot exceed 20 characters"
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Invalid Login Credentials", error: error.details[0].message });
  }
  next();
};




export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded._id || !decoded.role) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    // Optional: validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    let account;
    if (decoded.role === 'admin') {
       const Admin = await getAdminModel();

      account = await Admin.findById(decoded._id).select('-password');
    } else if (decoded.role === 'user') {
      const User = await getUserModel();

      account = await User.findById(decoded._id).select('-password');
    }

    if (!account) {
      return res.status(401).json({ message: 'Account not found' });
    }

    req.user = { _id: account._id, role: decoded.role };
    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};