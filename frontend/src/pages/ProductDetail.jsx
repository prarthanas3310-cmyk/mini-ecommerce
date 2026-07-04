import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ChevronLeft, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ProductStrip from "../components/ProductStrip";
import {
  addRecentlyViewed,
  getRecentlyViewed,
} from "../utils/recentlyViewed";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  useEffect(() => {
    setLoading(true);

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);

        addRecentlyViewed(data);
        setRecent(getRecentlyViewed(data._id));

        if (data.category) {
          api
            .get(
              `/products?category=${encodeURIComponent(
                data.category
              )}`
            )
            .then(({ data: all }) => {
              setRelated(
                all
                  .filter((p) => p._id !== data._id)
                  .slice(0, 8)
              );
            });
        }
      })
      .finally(() => setLoading(false));

    api
      .get(`/reviews/${id}`)
      .then(({ data }) => setReviews(data));

    setQty(1);
    setReviewForm({
      rating: 0,
      comment: "",
    });
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

      setReviewForm({
        rating: 0,
        comment: "",
      });

      const [
        { data: newReviews },
        { data: refreshedProduct },
      ] = await Promise.all([
        api.get(`/reviews/${id}`),
        api.get(`/products/${id}`),
      ]);

      setReviews(newReviews);
      setProduct(refreshedProduct);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-6 py-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            <div className="aspect-square rounded-3xl bg-[#171717] border border-[#2C2C2C] animate-pulse" />

            <div className="space-y-6">

              <div className="h-4 w-28 rounded-full bg-[#222]" />

              <div className="h-12 w-3/4 rounded-xl bg-[#222]" />

              <div className="h-8 w-40 rounded-xl bg-[#222]" />

              <div className="space-y-3">

                <div className="h-4 rounded bg-[#222]" />

                <div className="h-4 rounded bg-[#222]" />

                <div className="h-4 w-5/6 rounded bg-[#222]" />

              </div>

              <div className="flex gap-4 mt-8">

                <div className="h-14 w-36 rounded-xl bg-[#222]" />

                <div className="h-14 flex-1 rounded-xl bg-[#222]" />

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

if (!product) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-lg mb-4">
          Product not found.
        </p>

        <Link
          to="/"
          className="inline-block bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#E6C75C] transition-all duration-300"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}

const outOfStock = product.stock <= 0;
const lowStock = !outOfStock && product.stock <= 5;
const alreadyReviewed =
  user && reviews.some((r) => r.name === user.name);

return (
  <div className="min-h-screen bg-[#0D0D0D]">
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Back Button */}

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-10"
      >
        <ChevronLeft size={18} />
        Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Product Image */}

        <div
          className="rounded-3xl bg-[#171717] border border-[#2C2C2C] p-6 overflow-hidden shadow-2xl cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleImageMouseMove}
        >

          <div className="relative w-full h-full overflow-hidden rounded-2xl">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-200 ease-out"
              style={
                isZooming
                  ? {
                      transform: "scale(2)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : { transform: "scale(1)" }
              }
            />

          </div>

        </div>

        {/* Product Info */}

        <div>

          {product.category && (
            <span className="uppercase tracking-[4px] text-[#D4AF37] text-sm">
              {product.category}
            </span>
          )}

          <h1 className="text-5xl font-bold text-white mt-3 mb-5">
            {product.name}
          </h1>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-3 mb-5">

              <StarRating value={product.avgRating} />

              <span className="text-gray-400">
                {product.avgRating.toFixed(1)} (
                {product.numReviews} Review
                {product.numReviews !== 1 ? "s" : ""})
              </span>

            </div>
          )}

          <h2 className="text-4xl font-bold text-[#D4AF37] mb-6">
            ₹{product.price}
          </h2>

          <p className="text-gray-300 leading-8 text-lg mb-8">
            {product.description}
          </p>

          <div className="mb-8">

            {outOfStock ? (
              <span className="text-red-400 font-medium">
                Out of Stock
              </span>
            ) : lowStock ? (
              <span className="text-orange-400 font-medium">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-green-400 font-medium">
                {product.stock} in stock
              </span>
            )}

          </div>

          {!outOfStock && (

            <div className="flex flex-wrap gap-5 items-center">

              {/* Quantity */}

              <div className="flex items-center bg-[#171717] border border-[#2C2C2C] rounded-xl overflow-hidden">

                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                  className="p-4 text-white hover:bg-[#222] transition"
                >
                  <Minus size={18} />
                </button>

                <span className="w-16 text-center text-white font-semibold">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty((q) =>
                      Math.min(product.stock, q + 1)
                    )
                  }
                  className="p-4 text-white hover:bg-[#222] transition"
                >
                  <Plus size={18} />
                </button>

              </div>

              {/* Add to Cart */}

              <button
                onClick={handleAddToCart}
                disabled={justAdded}
                className={`flex-1 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg overflow-hidden relative ${
                  justAdded
                    ? "bg-green-500 text-white"
                    : "bg-[#D4AF37] text-black hover:bg-[#E6C75C]"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${
                    justAdded
                      ? "opacity-100 scale-100"
                      : "opacity-100 scale-100"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={20} className="animate-[bounce_0.6s_ease-in-out_1]" />
                      Added to Cart
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </span>
              </button>

            </div>

          )}

        </div>

      </div>

      {/* Reviews */}
      <div className="mt-20 max-w-5xl">
        <h2 className="text-3xl font-bold text-white mb-8">
          Customer Reviews{" "}
          {product.numReviews > 0 && `(${product.numReviews})`}
        </h2>

        {user && !alreadyReviewed && (
          <form
            onSubmit={submitReview}
            className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-6 mb-8 space-y-5"
          >
            <div>
              <p className="text-sm text-gray-400 mb-2">Your rating</p>
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
              className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] resize-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#E6C75C] transition disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {!user && (
          <p className="text-gray-400 mb-6">
            <Link to="/login" className="text-[#D4AF37] font-semibold hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet — be the first to review this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-5 mb-5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{r.name}</span>
                  <StarRating value={r.rating} size={13} />
                </div>
                <p className="text-gray-300 mt-2">{r.comment}</p>
                <p className="text-xs text-gray-500 mt-3">
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
     </div>
  
  );
}