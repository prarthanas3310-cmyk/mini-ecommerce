import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState({ address: "", city: "", postalCode: "", country: "" });
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    const items = cartItems.map((i) => ({
      product: i._id, name: i.name, quantity: i.quantity, price: i.price,
    }));
    await api.post("/orders", { items, totalAmount: totalPrice, shippingAddress: address });
    clearCart();
    navigate("/orders");
  };

  return (
    <form onSubmit={placeOrder} className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
      {["address", "city", "postalCode", "country"].map((field) => (
        <input
          key={field}
          className="border p-2 w-full mb-3 capitalize"
          placeholder={field}
          value={address[field]}
          onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
        />
      ))}
      <p className="font-bold mb-3">Total: ${totalPrice.toFixed(2)}</p>
      <button className="bg-black text-white w-full py-2 rounded">Place Order</button>
    </form>
  );
}
