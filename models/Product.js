//product model                                                                                                                                                                                                                                                 import mongoose from 'mongoose';
import { connectAdminDB } from '../config/db.js';
import mongoose from 'mongoose';
// Define schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  gst: { type: Number, default: 0 }, // GST %
  discount: { type: Number, default: 0 },  // Discount percentage
  totalPrice: {
    type: Number,
    default: function () {
       // Calculate total including GST and discount
       const discountedPrice = this.price - (this.price * this.discount) / 100;
      return discountedPrice + (discountedPrice * this.gst) / 100;
    },
  },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to auto-update totalPrice
productSchema.pre('save', function (next) {
  if (this.isModified('price') || this.isModified('gst') || this.isModified('discount')) {
     const discountedPrice = this.price - (this.price * this.discount) / 100;
    this.totalPrice = discountedPrice + (discountedPrice * this.gst) / 100;
  }
  next();
});

let Product; 

export const getProductModel = async () => {
  if (!Product) {
    const adminDB = await connectAdminDB(); // connect to admin DB
    Product = adminDB.model('Product', productSchema);
  }
  return Product;
};