// models/Wishlist.js
import mongoose from 'mongoose';
import { connectUserDB } from '../config/db.js';

const wishlistSchema = new mongoose.Schema({
   email:{type: String,required: true},
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
   discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 }, 
  totalPrice: {type: Number,default: 0},
  stock: { type: Number, default: 0 },
 
  category: {type:String, required: true},
  subcategory: {type:String},
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});





let MyWish;

export const getWishlistModel = async () => {
  if (!MyWish) {
    const userDB = await connectUserDB();
    MyWish = userDB.model('MyWish', wishlistSchema); // 'WishListes' is your collection name
  }
  return MyWish;
};