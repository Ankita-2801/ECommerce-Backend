// models/Review.js
import mongoose from 'mongoose';
import { connectUserDB } from '../config/db.js';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { 
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
 
  verified: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true 
});

let ReviewModel; 

export const getReviewModel = async () => {
  if (!ReviewModel) {
    
    const userDB = await connectUserDB();
    ReviewModel = userDB.model('Review', reviewSchema);
  }
  return ReviewModel;
};