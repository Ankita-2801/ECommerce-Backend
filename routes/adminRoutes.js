// routes/adminRoutes.js
import express from 'express';
import { getAdminProfile , getAllUsers, getUserDetails, 
    getDashboardMetrics, getSalesChartData,globalAdminSearch} from '../controllers/adminController.js';
import { getAllOrders } from '../controllers/orderController.js';
import { protect,authorizeAdmin } from '../middleware/authMiddleware.js';
import { bulkOfferSend } from '../controllers/adminController.js';
const router = express.Router();
router.get('/profile', protect, getAdminProfile);
router.get('/users', protect, authorizeAdmin, getAllUsers);
router.get('/users/:id', protect, authorizeAdmin, getUserDetails);
router.get('/user-details', protect, authorizeAdmin, getUserDetails); // ✅ NEW route for fetch user's specific orders history

router.get('/metrics', protect, authorizeAdmin, getDashboardMetrics);
router.get('/sales-chart', protect, authorizeAdmin, getSalesChartData);
router.get('/search', protect, authorizeAdmin, globalAdminSearch); // <-- NEW GLOBAL SEARCH ROUTE
router.get('/orders', protect, authorizeAdmin, getAllOrders);
router.post('/send-bulk-email', protect, authorizeAdmin, bulkOfferSend);
export default router;