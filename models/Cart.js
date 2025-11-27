import mongoose from 'mongoose';
import { connectUserDB } from '../config/db.js';

const cartSchema = new mongoose.Schema({
  email:{type: String,required: true},
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
   discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 }, 
  totalPrice: {
    type: Number,
    default: function () {
       
       const discountedPrice = this.price - (this.price * this.discount) / 100;
      return discountedPrice + (discountedPrice * this.gst) / 100;
    },
  },
  stock: { type: Number, default: 0 },
  quantity: {type: Number, default: 0},
  category: {type:String, required: true},
  subcategory: {type:String},
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

let Cart;

export const getCartModel = async () => {
  if (!Cart) {
    const userDB = await connectUserDB();
    Cart = userDB.model('Cart', cartSchema);
  }
  return Cart;
};
