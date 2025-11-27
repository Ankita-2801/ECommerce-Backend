// routes/reviewRoutes.js
import express from 'express';
import {
  getReviews,
  createReview,
  markReviewHelpful,
  approveReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/:id/helpful').put(markReviewHelpful);
router.route('/:id/approve').put(approveReview);
router.route('/:id').delete(deleteReview);

export default router;
