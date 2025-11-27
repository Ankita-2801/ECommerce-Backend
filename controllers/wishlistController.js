// controllers/wishlistController.js
import { getWishlistModel } from '../models/Wishlist.js';

// Get wishlist for a user
export const getWishlist = async (req, res) => {
  const email=req.query.email;
  try {
    const Wishlist = await getWishlistModel();
    const items = await Wishlist.find({ email: email });
    res.status(200).json({ items });
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { name, description, price, stock, category, subcategory, imageUrl } = req.body;
    const Wishlist = await getWishlistModel();

    const newWish = new Wishlist({
      email: req.user.email,
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      imageUrl,
    });

    await newWish.save();
    res.status(201).json({ success: true, message: "Added to wishlist", data: newWish });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Already in wishlist" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove single item
export const removeFromWishlist = async (req, res) => {
  try {
    const Wishlist = await getWishlistModel();
    const { name } = req.params;

    const deleted = await Wishlist.findOneAndDelete({ email: req.user.email, name });
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });

    const items = await Wishlist.find({ email: req.user.email });
    res.status(200).json({ success: true, message: "Removed", data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const Wishlist = await getWishlistModel();
    await Wishlist.deleteMany({ email: req.user.email });
    res.status(200).json({ success: true, message: "Wishlist cleared", data: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
