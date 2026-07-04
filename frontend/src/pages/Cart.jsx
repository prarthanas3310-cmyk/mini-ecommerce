import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            message="Nothing here yet. Browse the shop and add something you like."
            action={
              <Link
                to="/"
                className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#E6C75C] transition-all duration-300"
              >
                Browse products
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 49;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-[#D4AF37]/40 transition-colors duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#2C2C2C] flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {item.name}
                  </p>
                  <span className="text-[#D4AF37] font-bold mt-1 inline-block">
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex items-center bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    className="p-2.5 text-white hover:bg-[#222] transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-white font-medium text-sm">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="p-2.5 text-white hover:bg-[#222] transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-500 hover:text-red-400 p-2 transition-colors flex-shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-6 sticky top-6">
            <h2 className="text-lg font-bold text-white mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white">
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Add ₹{(999 - cartTotal).toFixed(2)} more for free shipping.
                </p>
              )}
            </div>

            <div className="h-px bg-[#2C2C2C] my-5" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-[#D4AF37]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#D4AF37] text-black font-semibold py-3.5 rounded-xl hover:bg-[#E6C75C] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10"
            >
              Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-gray-400 hover:text-[#D4AF37] text-sm mt-4 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}