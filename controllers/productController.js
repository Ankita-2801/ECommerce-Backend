import mongoose from "mongoose";
import { getReviewModel } from "../models/Review.js";
import { getProductModel } from "../models/Product.js";
import { getOrderModel } from "../models/Order.js";
import { getWishlistModel } from "../models/Wishlist.js";
import { getCartModel } from "../models/Cart.js";
// Add Product
//ProductController(only changes portion )                                                                                                                                                                                                         // Add Product
export const addProduct = async (req, res) => {
  try {
    const Product = await getProductModel();
    const {
      name,
      description,
      price,
      gst,
      discount,
      stock,
      category,
      subcategory,
      imageUrl,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      gst: gst ?? 0,
      discount: discount ?? 0, // Use 0 if gst is not provided
      stock,
      category,
      subcategory,
      imageUrl,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Update Product
export const updateProduct = async (req, res) => {
  try {
    const Product = await getProductModel();
    const { id } = req.params;
    const {
      name,
      description,
      price,
      gst,
      discount,
      stock,
      category,
      subcategory,
      imageUrl,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.gst = gst ?? 0;
    discount: discount ?? 0, (product.stock = stock);
    product.category = category;
    product.subcategory = subcategory;
    product.imageUrl = imageUrl;

    // Saving triggers pre('save') hook → totalPrice recalculated
    const updatedProduct = await product.save();

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const Product = await getProductModel();
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const Product = await getProductModel();
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSpecificProducts = async (req, res) => {
  const subcategory = req.params.pronm;
  try {
    const Product = await getProductModel();
    const products = await Product.find({ subcategory });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching specific products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductsbyId = async (req, res) => {
  const _id = req.params._id;
  try {
    const Product = await getProductModel();
    const products = await Product.find({ _id });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching specific products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createOrders = async (req, res) => {
  try {
    const {
      user,
      products,
      cartTotal,
      paymentMethod,
      transactionId,
      today,
      days,
      deliveryDate,
    } = req.body;
    const todayDate = new Date(today);
    const delivery = new Date(deliveryDate);

    if (!user || products.length === 0 || !products) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const Order = await getOrderModel();
    const order = new Order({
      user,
      products: products.map((p) => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity || 1,
        price: p.price * (p.quantity || 1),
        discount: p.discount * (p.quantity || 1),
        gst: p.gst * (p.quantity || 1),
        totalPrice: p.totalPrice * (p.quantity || 1),
        imageUrl: p.imageUrl,
      })),
      cartTotal,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "Cash on Delivery" ? "Pending" : "Completed",
      },
        transactionId: paymentMethod === "Cash on Delivery" ? null : transactionId,
      orderedAt: todayDate.toDateString(),
      days: days.toString(),
      deliveryDate: delivery.toDateString(),
    });

    const savedOrder = await order.save();

    //stock reduction
    const Product = await getProductModel();
    for (const item of products) {
      const dbProduct = await Product.findOne({ name: item.name });
      if (dbProduct) {
        dbProduct.stock = Math.max(0, dbProduct.stock - (item.quantity || 1)); // Prevent negative stock
        await dbProduct.save();
      } else {
        console.log(`Product not found in database: ${item.name}`);
      }
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId, email, productname } = req.body;

  try {
    const Product = await getProductModel();
    const MyWish = await getWishlistModel();

    if (!productId || !email) {
      return res
        .status(400)
        .json({ message: "Product ID and email are required." });
    }

    const product = await Product.findOne({ _id: productId });

    /* const product = await Cart.findOne({name:req.body.productname});
    console.log(product);
    console.log(productId);*/
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found in the product database." });
    }

    const existingWishlistItem = await MyWish.findOne({
      email: email,
      name: productname,
    });
    if (existingWishlistItem) {
      return res
        .status(409)
        .json({ message: "Product is already in your wishlist." }); // Use 409 Conflict
    }

    const newWish = new MyWish({
      email: email,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      gst: product.gst,
      totalPrice: product.totalPrice,
      stock: product.stock,
      category: product.category,
      subcategory: product.subcategory,
      imageUrl: product.imageUrl,
    });
    console.log(newWish);
    await newWish.save();
    
    res.status(201).json({
      message: "Product is added to wishlist successfully!",
      item: newWish,
    }); // Use 201 Created
  } catch (err) {
    console.error("Error in addToWishlist:", err);

    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Product is already in your wishlist." });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, email, productname, quantity } = req.body;
  try {
    const Product = await getProductModel();
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Failed to find product" });
    }
    const Cart = await getCartModel();
   

    const newcart = new Cart({
      email: email,
      name: product.name,
      description: product.description,
      price: product.price,
      gst: product.gst,
      discount: product.discount,
      totalPrice: product.totalPrice,
      stock: product.stock,
      quantity: quantity,
      category: product.category,
      imageUrl: product.imageUrl,
    });
    await newcart.save();
    res.status(200).json({ message: "Product is saved to wishlist" });
  } catch (err) {
    console.log(err);
  }
};

export const fetchCart = async (req, res) => {
  const { email } = req.query;
  try {
    const cart = await getCartModel();
    const items = await cart.find({ email });
    res.status(200).json({ items });
  } catch (err) {
    console.log(err);
  }
};
export const fetchWish = async (req, res) => {
  const { email } = req.query;
  try {
    const wish = await getWishlistModel();
    const items = await cart.find({ email });
    res.status(200).json({ items });
  } catch (err) {}
};

export const deleteCart = async (req, res) => {
  const { productId, email } = req.body;

  try {
    const CartModel = await getCartModel();

    const cartItemIdToDelete = new mongoose.Types.ObjectId(productId);

    const result = await CartModel.deleteOne({
      _id: cartItemIdToDelete,
      email: email,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Cart item not found or already deleted." });
    }

    const allitem = await CartModel.find({ email: email });

    return res.status(200).json({ allitem });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: "Invalid cart item ID format provided." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteWish = async (req, res) => {
  const { productname, email } = req.body;
  try {
    const wish = await getWishlistModel();
    const item = await wish.findOne({ name: productname, email: email });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    await wish.deleteOne({ name: productname, email: email });
    return res.status(200).json({ message: "Wish Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cartCount = async (req, res) => {
  const { email } = req.query;
  try {
    const cart = await getCartModel();
    const count = await cart.countDocuments({ email });
    res.status(200).json({ count });
  } catch (err) {
    console.log(err);
  }
};

export const wishCount = async (req, res) => {
  const { email } = req.query;
  try {
    const wish = await getWishlistModel();
    const count = await wish.countDocuments({ email });
    res.status(200).json({ count });
  } catch (err) {
    console.log(err);
  }
};
export const orderCount=async(req,res)=>{
  const {email}=req.query;
  try{
      const Order=await getOrderModel();
      const count=await Order.countDocuments({'user.email':email});
      res.status(200).json({count});
  }catch(err){}
}
export const deleteAllCart = async (req, res) => {
  const { email } = req.body;
  try {
    const cart = await getCartModel();
    const delitem = await cart.find({ email });
    const result = await cart.deleteMany({ email });
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const checkCart = async (req, res) => {
  const { email, productId } = req.query;
  try {
    const Cart = await getCartModel();
    const cart = await Cart.findOne({ email, _id: productId });
    res.json({ exists: !!cart });
  } catch (err) {}
};

export const fetchReview = async (req, res) => {
  const { name } = req.params;
  try {
    const Review = await getReviewModel();
    const review = await Review.find({
      product: { $regex: new RegExp(`^${name}$`, "i") },
    });

    res.status(200).json({ reviews: review });
  } catch (err) {}
};

export const updateStock = async (req, res) => {
  const { productId, stock } = req.body;
  try {
    const Product = await getProductModel();
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock: stock },
      { new: true }
    );
  } catch (err) {}
};
