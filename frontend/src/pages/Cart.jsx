import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0)
    return <p className="p-6">Your cart is empty. <Link to="/" className="underline">Shop now</Link></p>;

  return (
    <div className="p-6">
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center gap-4">
            <img src={item.image} className="h-16 w-16 object-cover rounded" />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">${item.price}</p>
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
            className="border w-16 p-1"
          />
          <button onClick={() => removeFromCart(item._id)} className="text-red-500">Remove</button>
        </div>
      ))}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
