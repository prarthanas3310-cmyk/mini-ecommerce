import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Nothing here yet. Browse the shop and add something you like."
          action={
            <Link to="/" className="btn-primary">
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Your Cart</h1>

      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div key={item._id} className="card p-4 flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md border border-ink/10"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{item.name}</p>
              <span className="price-tag mt-1">₹{item.price}</span>
            </div>

            <div className="flex items-center border border-ink/15 rounded-md">
              <button
                onClick={() => updateQty(item._id, item.qty - 1)}
                className="p-2 hover:bg-ink/5"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-mono text-sm">{item.qty}</span>
              <button
                onClick={() => updateQty(item._id, item.qty + 1)}
                className="p-2 hover:bg-ink/5"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-clay/70 hover:text-clay p-2"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5 flex items-center justify-between">
        <span className="font-display text-lg font-medium">
          Total: <span className="price-tag ml-1 text-base">₹{cartTotal.toFixed(2)}</span>
        </span>
        <button onClick={() => navigate("/checkout")} className="btn-primary">
          Checkout
        </button>
      </div>
    </div>
  );
}
