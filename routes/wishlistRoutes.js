// routes/wishlistRoutes.js
import express from 'express';
import { getWishlist } from '../controllers/wishlistController.js';
const router = express.Router();

// All routes require auth
router.get('/',  getWishlist);


export default router;
