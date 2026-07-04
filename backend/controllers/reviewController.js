import Review from "../models/Review.js";
import Product from "../models/Product.js";

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const avgRating = numReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;
  await Product.findByIdAndUpdate(productId, { avgRating, numReviews });
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    await recalculateProductRating(productId);

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const productId = review.product;
    await review.deleteOne();
    await recalculateProductRating(productId);

    res.json({ message: "Review removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
