import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium",
  "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Ireland",
  "Portugal", "Austria", "Poland", "Greece", "United Arab Emirates",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Singapore",
  "Malaysia", "Indonesia", "Thailand", "Vietnam", "Philippines",
  "Japan", "South Korea", "China", "Hong Kong", "Taiwan",
  "New Zealand", "South Africa", "Nigeria", "Kenya", "Egypt",
  "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru",
  "Bangladesh", "Pakistan", "Sri Lanka", "Nepal",
  "Russia", "Turkey", "Israel", "Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [focusField, setFocusField] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country" && value !== "India") {
      setForm((prev) => ({ ...prev, country: value, state: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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

  const floatField = (name, label, extraClass = "") => (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          focusField === name || form[name]
            ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
            : "top-3.5 text-gray-500"
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={form[name]}
        onChange={handleChange}
        onFocus={() => setFocusField(name)}
        onBlur={() => setFocusField(null)}
        required
        className={`w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 ${extraClass}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
          Almost there
        </span>
        <h1 className="text-3xl font-bold text-white mt-3 mb-8">Checkout</h1>

        <form onSubmit={placeOrder}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Shipping Details */}
            <div className="lg:col-span-2 bg-[#171717] border border-[#2C2C2C] rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-white mb-1">
                Shipping Details
              </h2>

              {floatField("address", "Address")}

              <div className="grid sm:grid-cols-2 gap-5">
                {floatField("city", "City")}
                {floatField("postalCode", "Postal Code")}
              </div>

              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                    focusField === "country" || form.country
                      ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
                      : "top-3.5 text-gray-500"
                  }`}
                >
                  Country
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  onFocus={() => setFocusField("country")}
                  onBlur={() => setFocusField(null)}
                  required
                  className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 appearance-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0D0D0D] text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-4 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {form.country === "India" && (
                <div className="relative">
                  <label
                    className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                      focusField === "state" || form.state
                        ? "-top-2.5 text-xs bg-[#171717] px-1 text-[#D4AF37]"
                        : "top-3.5 text-gray-500"
                    }`}
                  >
                    State
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    onFocus={() => setFocusField("state")}
                    onBlur={() => setFocusField(null)}
                    required
                    className="w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0D0D0D] text-gray-500">
                      Select a state
                    </option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#0D0D0D] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-4 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-6 sticky top-6">
              <h2 className="text-lg font-bold text-white mb-5">
                Order Summary
              </h2>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-5">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-300 truncate pr-2">
                      {item.name}{" "}
                      <span className="text-gray-500">× {item.qty}</span>
                    </span>
                    <span className="text-gray-400 font-mono shrink-0">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#2C2C2C] mb-5" />

              {/* Coupon */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl px-3 py-2.5">
                    <span className="text-sm text-[#D4AF37] font-medium inline-flex items-center gap-1.5">
                      <Tag size={14} />
                      {appliedCoupon.code} — {appliedCoupon.discountPercent}% off
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label="Remove coupon"
                    >
                      <X size={15} className="text-[#D4AF37] hover:text-[#E6C75C]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 min-w-0 bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applyingCoupon}
                      className="shrink-0 border border-[#2C2C2C] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-50"
                    >
                      {applyingCoupon ? "Checking..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cartTotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#2C2C2C] my-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D4AF37] text-black font-semibold py-3.5 rounded-xl hover:bg-[#E6C75C] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}