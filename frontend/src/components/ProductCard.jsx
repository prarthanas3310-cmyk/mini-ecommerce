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
    <div className="card group overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block">
          <div className="aspect-[4/3] w-full overflow-hidden bg-teal-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-tag transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={saved ? "fill-clay text-clay" : "text-ink/50"}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.category && <span className="eyebrow">{product.category}</span>}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display text-lg font-medium text-ink leading-snug line-clamp-2 hover:text-teal-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={product.avgRating} size={12} />
            <span className="text-[11px] text-ink/40">({product.numReviews})</span>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="price-tag">₹{product.price}</span>

          <button
            onClick={() => !outOfStock && addToCart(product, 1)}
            disabled={outOfStock}
            className="inline-flex items-center gap-1 text-xs font-medium bg-teal-500 text-white px-2.5 py-1.5 rounded-md hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        {outOfStock && <span className="text-xs font-mono text-clay">Out of stock</span>}
        {lowStock && <span className="text-xs font-mono text-clay">Only {product.stock} left</span>}
      </div>
    </div>
  );
}
