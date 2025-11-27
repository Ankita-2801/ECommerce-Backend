// controllers/reviewController.js
import { getReviewModel } from '../models/Review.js';
import { getUserModel } from '../models/User.js';

export const getReviews = async (req, res) => {
  try {
    const Review = await getReviewModel();
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

export const createReview = async (req, res) => {
  const { product, rating, comment, email } = req.body;

  if (!product || !rating || !comment || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const User = await getUserModel();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const Review = await getReviewModel();
    const newReview = new Review({
      product,
      rating: Number(rating),
      comment,
      user: user._id,
      userName: user.username,
      verified: true,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

export const markReviewHelpful = async (req, res) => {
  try {
    const Review = await getReviewModel();
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.helpful += 1;
    await review.save();

    res.status(200).json(review);
  } catch (err) {
    console.error('Error marking helpful:', err);
    res.status(500).json({ message: 'Failed to mark helpful', error: err.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const Review = await getReviewModel();
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.verified = true;
    await review.save();

    res.status(200).json({ message: 'Review approved', review });
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ message: 'Failed to approve review', error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const Review = await getReviewModel();
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
