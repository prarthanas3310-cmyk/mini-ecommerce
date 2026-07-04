import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LogOut,
  Shield,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass =
    "text-sm font-medium text-white/90 hover:text-white transition-colors";

  return (
    <header
      className={`sticky top-0 z-50 bg-teal-600 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="text-white text-2xl font-bold"
          onClick={closeMenu}
        >
          MiniShop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/" className={linkClass}>
            Products
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`${linkClass} flex items-center gap-1`}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}

          <Link
            to="/cart"
            className={`${linkClass} flex items-center gap-1 relative`}
          >
            <ShoppingBag size={18} />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-black rounded-full text-xs px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className={linkClass}>
                My Orders
              </Link>
              <Link to="/wishlist" className={`${linkClass} flex items-center gap-1`}>
      <Heart size={16} />
      Wishlist
    </Link>

              <button
                onClick={handleLogout}
                className={`${linkClass} flex items-center gap-1`}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-teal-600 px-4 pb-4 space-y-4">

          <Link
            to="/"
            onClick={closeMenu}
            className="block text-white"
          >
            Products
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className="block text-white"
            >
              Admin
            </Link>
          )}

          <Link
            to="/cart"
            onClick={closeMenu}
            className="block text-white"
          >
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block text-white"
              >
                My Orders
              </Link>


    <Link
      to="/wishlist"
      onClick={closeMenu}
      className="block text-white"
    >
      Wishlist
    </Link>


              <button
                onClick={handleLogout}
                className="block text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="block bg-white text-teal-600 rounded-md px-3 py-2 w-fit"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}