import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass =
    "text-sm font-medium text-white/85 hover:text-white transition-colors";

  return (
    <header
      className={`sticky top-0 z-40 bg-teal-500 transition-shadow ${
        scrolled ? "shadow-lg shadow-ink/10" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold text-white tracking-tight">
          MiniShop
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className={linkClass}>
            Products
          </Link>

          {isAdmin && (
            <Link to="/admin" className={`${linkClass} inline-flex items-center gap-1`}>
              <Shield size={14} /> Admin
            </Link>
          )}

          <Link to="/cart" className={`${linkClass} relative inline-flex items-center gap-1`}>
            <ShoppingBag size={16} />
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-marigold-500 text-ink text-[11px] font-mono font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className={linkClass}>
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/85 hover:text-clay transition-colors inline-flex items-center gap-1"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-white text-teal-600 px-3 py-1.5 rounded-md hover:bg-marigold-100 transition-colors"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
