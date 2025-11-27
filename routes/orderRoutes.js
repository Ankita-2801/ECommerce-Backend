
import express from 'express';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import {  getAllOrders,updateOrderStatus, cancelOrder ,getOrdersByEmail, getOrders} from '../controllers/orderController.js';

const router = express.Router();
router.get('/user/:email', protect, getOrdersByEmail);
router.get('/history',getOrdersByEmail);

// Only admin can access
router.get('/', protect, authorizeAdmin, getAllOrders);
router.put('/:id/status', protect, authorizeAdmin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;