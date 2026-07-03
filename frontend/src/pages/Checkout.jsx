import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        totalAmount: cartTotal,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not place order"
      );
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

          <div className="flex items-center justify-between pt-3">
            <span className="font-display text-lg font-medium">
              Total:
              <span className="price-tag ml-2">
                ₹{cartTotal.toFixed(2)}
              </span>
            </span>
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