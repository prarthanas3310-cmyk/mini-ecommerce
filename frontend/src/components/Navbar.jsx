import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <Link to="/" className="text-xl font-bold">MiniShop</Link>
      <div className="flex items-center gap-6">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({count})</Link>
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            <button onClick={logout} className="text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
