import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

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
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          {product.category && <span className="eyebrow mb-2">{product.category}</span>}
          <h1 className="font-display text-3xl font-semibold text-ink mb-3">
            {product.name}
          </h1>
          <span className="price-tag w-fit text-base mb-5">₹{product.price}</span>

          <p className="text-ink/70 leading-relaxed mb-6">{product.description}</p>

          <p className="text-xs font-mono mb-6">
            {outOfStock ? (
              <span className="text-clay">Out of stock</span>
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

              <button
                onClick={() => addToCart(product, qty)}
                className="btn-primary flex-1"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
