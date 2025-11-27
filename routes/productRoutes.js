import express from 'express';
import { fetchByEmail,updateProfile } from '../controllers/userController.js';
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSpecificProducts,
  getProductsbyId,
  createOrders,
  addToWishlist,wishCount,checkCart,
  addToCart, deleteAllCart,deleteCart,cartCount,
  fetchCart
} from '../controllers/productController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

//router.use(protect, authorizeAdmin);

router.post('/', addProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:pronm',getSpecificProducts);
router.get('/:id',getProductsbyId);



export default router;
