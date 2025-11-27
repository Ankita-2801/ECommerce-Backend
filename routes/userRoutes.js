// routes/adminRoutes.js
import express from 'express';
import { protect,authorizeAdmin } from '../middleware/authMiddleware.js';
import { createOrders,addToWishlist, addToCart, fetchCart, deleteCart, cartCount, wishCount, deleteAllCart, checkCart, fetchReview, deleteWish, fetchWish, updateStock } from '../controllers/productController.js';
import { fetchByEmail, fetchProfile, updateProfile } from '../controllers/userController.js';
import { getOrders } from '../controllers/orderController.js';
import { createDeliveryDate } from '../utils/deliveryDate.js';

const router = express.Router();
router.get('/profile',protect,fetchProfile)
router.put('/profile',protect,updateProfile)


//Ankita
router.get('/check',protect,fetchByEmail);
router.put('/edit',protect,updateProfile);
router.post('/create-orders',createOrders);
router.post('/stock',updateStock);
router.post('/addwish',addToWishlist);
router.get('/wish',fetchWish);
router.delete('/delwish',deleteWish);
router.post('/addcart',addToCart);
router.get('/getcart',fetchCart);
router.delete('/delcart',deleteCart);
router.get('/countcart',cartCount);
router.get('/countwish',wishCount);
router.post('/delallcart',deleteAllCart);
router.get('/checkcart',checkCart);
router.get('/review/:name',fetchReview);
router.get('/orders', getOrders);
router.get('/date',createDeliveryDate);

export default router;