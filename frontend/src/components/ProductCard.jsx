import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="card group overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
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

      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.category && (
          <span className="eyebrow">{product.category}</span>
        )}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display text-lg font-medium text-ink leading-snug line-clamp-2 hover:text-teal-600 transition-colors">
            {product.name}
          </h3>
        </Link>

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

        {outOfStock && (
          <span className="text-xs font-mono text-clay">Out of stock</span>
        )}
      </div>
    </div>
  );
}
