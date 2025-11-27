import mongoose from 'mongoose';
import { connectAdminDB } from '../config/db.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      username: { type: String, required: false },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        gst:{type:Number,required: true},
        discount:{type:Number,required: true},
        totalPrice: { type: Number,default:0 },
        imageUrl: String,
      },
    ],
    cartTotal: { type: Number, required: true }, // sum of all totalPrice
    payment: {
      method: { type: String, enum: [ "UPI", "Cash on Delivery"], required: true },
      status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    },
   transactionId: {
    type: String,
    required: function () {
      // Required only if payment method is not COD
      return this.payment?.method !== "Cash on Delivery";
    },
  },
    orderedAt: {type: String, required: true},
     days: {type: String, required: true},
      deliveryDate: {type: String, required: true},
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

let Order;

export const getOrderModel = async () => {
  if (!Order) {
    const adminDB = await connectAdminDB();
    Order = adminDB.model('Order', orderSchema);
  }
  return Order;
};