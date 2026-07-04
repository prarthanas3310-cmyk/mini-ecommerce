import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ProductStrip from "../components/ProductStrip";
import { addRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        addRecentlyViewed(data);
        setRecent(getRecentlyViewed(data._id));
        if (data.category) {
          api.get(`/products?category=${encodeURIComponent(data.category)}`).then(({ data: all }) => {
            setRelated(all.filter((p) => p._id !== data._id).slice(0, 8));
          });
        }
      })
      .finally(() => setLoading(false));

    api.get(`/reviews/${id}`).then(({ data }) => setReviews(data));
    setQty(1);
    setReviewForm({ rating: 0, comment: "" });
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${id}`, reviewForm);
      toast.success("Review submitted");
      setReviewForm({ rating: 0, comment: "" });
      const [{ data: newReviews }, { data: refreshedProduct }] = await Promise.all([
        api.get(`/reviews/${id}`),
        api.get(`/products/${id}`),
      ]);
      setReviews(newReviews);
      setProduct(refreshedProduct);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-lg skeleton" />
        <div className="space-y-4">
          <div className="h-4 w-20 rounded skeleton" />
          <div className="h-8 w-3/4 rounded skeleton" />
          <div className="h-24 w-full rounded skeleton" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-ink/60">Product not found.</p>
        <Link to="/" className="text-teal-600 font-medium">
          Back to products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const alreadyReviewed = user && reviews.some((r) => r.name === user.name);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-teal-600 mb-6 transition-colors"
      >
        <ChevronLeft size={15} /> Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-lg overflow-hidden bg-teal-50 border border-ink/10">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          {product.category && <span className="eyebrow mb-2">{product.category}</span>}
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating value={product.avgRating} />
              <span className="text-xs text-ink/50">
                {product.avgRating.toFixed(1)} ({product.numReviews} review
                {product.numReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <span className="price-tag w-fit text-base mb-5">₹{product.price}</span>

          <p className="text-ink/70 leading-relaxed mb-6">{product.description}</p>

          <p className="text-xs font-mono mb-6">
            {outOfStock ? (
              <span className="text-clay">Out of stock</span>
            ) : lowStock ? (
              <span className="text-clay">Only {product.stock} left in stock</span>
            ) : (
              <span className="text-teal-600">{product.stock} in stock</span>
            )}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-ink/15 rounded-md">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-ink/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-2.5 hover:bg-ink/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={() => addToCart(product, qty)} className="btn-primary flex-1">
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14 max-w-2xl">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          Reviews {product.numReviews > 0 && `(${product.numReviews})`}
        </h2>

        {user && !alreadyReviewed && (
          <form onSubmit={submitReview} className="card p-4 mb-6 space-y-3">
            <div>
              <p className="text-xs text-ink/50 mb-1">Your rating</p>
              <StarRating
                value={reviewForm.rating}
                interactive
                size={20}
                onChange={(rating) => setReviewForm({ ...reviewForm, rating })}
              />
            </div>
            <textarea
              placeholder="Share your thoughts about this product..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
              rows={3}
              className="input-field resize-none"
            />
            <button type="submit" disabled={submittingReview} className="btn-primary">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {!user && (
          <p className="text-sm text-ink/50 mb-6">
            <Link to="/login" className="text-teal-600 font-medium">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-ink/40">No reviews yet — be the first to review this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-ink/10 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-ink">{r.name}</span>
                  <StarRating value={r.rating} size={13} />
                </div>
                <p className="text-sm text-ink/60">{r.comment}</p>
                <p className="text-xs text-ink/30 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductStrip title="Related Products" products={related} />
      <ProductStrip title="Recently Viewed" products={recent} />
    </div>
  );
}
