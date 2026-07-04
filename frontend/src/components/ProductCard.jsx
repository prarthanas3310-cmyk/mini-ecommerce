import { Link } from "react-router-dom";
import { Plus, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const saved = isWishlisted(product._id);

  return (
    <div className="group overflow-hidden rounded-2xl bg-[#171717] border border-[#2C2C2C] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]">

      {/* IMAGE */}
      <div className="relative">

        {product.stock > 15 && (
          <span className="absolute top-3 left-3 z-10 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full shadow">
            NEW
          </span>
        )}

        <Link to={`/product/${product._id}`} className="block">

          <div className="aspect-[4/3] w-full overflow-hidden bg-[#111111]">

            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

          </div>

        </Link>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={
            saved
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 backdrop-blur border border-[#2C2C2C] flex items-center justify-center transition-all duration-300 hover:border-[#D4AF37] hover:scale-110"
        >
          <Heart
            size={18}
            className={
              saved
                ? "fill-[#D4AF37] text-[#D4AF37]"
                : "text-gray-400"
            }
          />
        </button>

      </div>

      {/* CONTENT */}

      <div className="p-5 flex flex-col flex-1">

        {product.category && (
          <span className="text-xs uppercase tracking-[2px] text-[#D4AF37] mb-2">
            {product.category}
          </span>
        )}

        <Link to={`/product/${product._id}`}>

          <h3 className="text-lg font-semibold text-white leading-snug line-clamp-2 hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>

        </Link>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-2 mt-2">

            <StarRating
              value={product.avgRating}
              size={13}
            />

            <span className="text-xs text-gray-400">
              ({product.numReviews})
            </span>

          </div>
        )}

        <div className="flex items-center justify-between mt-5">

          <span className="text-2xl font-bold text-[#D4AF37]">
            ₹{product.price}
          </span>

          <button
            onClick={() =>
              !outOfStock &&
              addToCart(product, 1)
            }
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#E6C75C] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus size={16} />
            Add
          </button>

        </div>

        {outOfStock && (
          <span className="mt-3 text-sm text-red-400 font-medium">
            Out of Stock
          </span>
        )}

        {lowStock && (
          <span className="mt-3 text-sm text-orange-400 font-medium">
            Only {product.stock} left
          </span>
        )}

      </div>

    </div>
  );
}