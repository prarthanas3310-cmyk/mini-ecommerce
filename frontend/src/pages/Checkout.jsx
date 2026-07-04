import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const discountAmount = appliedCoupon
    ? (cartTotal * appliedCoupon.discountPercent) / 100
    : 0;
  const finalTotal = cartTotal - discountAmount;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponInput.trim() });
      setAppliedCoupon(data);
      toast.success(`Coupon applied — ${data.discountPercent}% off`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/orders", {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
        })),
        shippingAddress: form,
        totalAmount: finalTotal,
        couponCode: appliedCoupon?.code,
        discountAmount,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <div className="card p-6">
        <h1 className="font-display text-xl font-semibold text-ink mb-5">
          Shipping Details
        </h1>

        <form onSubmit={placeOrder} className="space-y-3">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            className="input-field"
          />

          {/* Coupon */}
          <div className="pt-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
                <span className="text-sm text-teal-700 font-medium inline-flex items-center gap-1.5">
                  <Tag size={14} />
                  {appliedCoupon.code} — {appliedCoupon.discountPercent}% off applied
                </span>
                <button type="button" onClick={removeCoupon} aria-label="Remove coupon">
                  <X size={15} className="text-teal-700" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applyingCoupon}
                  className="btn-secondary shrink-0"
                >
                  {applyingCoupon ? "Checking..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 space-y-1.5">
            {appliedCoupon && (
              <div className="flex items-center justify-between text-sm text-ink/50">
                <span>Subtotal</span>
                <span className="font-mono">₹{cartTotal.toFixed(2)}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-sm text-teal-600">
                <span>Discount ({appliedCoupon.discountPercent}%)</span>
                <span className="font-mono">−₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-medium">Total:</span>
              <span className="price-tag text-base">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
