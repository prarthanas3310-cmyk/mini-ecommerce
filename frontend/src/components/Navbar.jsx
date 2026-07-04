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
import logo from "../assets/parzen-logo.png";

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
    "text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-all duration-300";

  return (
    <header
      className={`sticky top-0 z-50 bg-[#0D0D0D] border-b border-[#2C2C2C] transition-all duration-300 ${
        scrolled ? "shadow-2xl shadow-black/50" : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            src={logo}
            alt="PARZEN"
            className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

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
            className={`${linkClass} flex items-center gap-2 relative`}
          >
            <ShoppingBag size={18} />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black font-bold rounded-full text-xs px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className={linkClass}>
                My Orders
              </Link>

              <Link
                to="/wishlist"
                className={`${linkClass} flex items-center gap-1`}
              >
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
                className="bg-[#D4AF37] text-black px-5 py-2 rounded-lg font-semibold hover:bg-[#E6C75C] transition-all duration-300 shadow-lg hover:shadow-yellow-500/30"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-[#D4AF37]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-[#2C2C2C] px-6 py-6 space-y-5">

          <Link
            to="/"
            onClick={closeMenu}
            className="block text-gray-300 hover:text-[#D4AF37] transition"
          >
            Products
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className="block text-gray-300 hover:text-[#D4AF37]"
            >
              Admin
            </Link>
          )}

          <Link
            to="/cart"
            onClick={closeMenu}
            className="block text-gray-300 hover:text-[#D4AF37]"
          >
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block text-gray-300 hover:text-[#D4AF37]"
              >
                My Orders
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="block text-gray-300 hover:text-[#D4AF37]"
              >
                Wishlist
              </Link>

              <button
                onClick={handleLogout}
                className="block text-gray-300 hover:text-[#D4AF37]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-gray-300 hover:text-[#D4AF37]"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="inline-block bg-[#D4AF37] text-black px-5 py-2 rounded-lg font-semibold hover:bg-[#E6C75C] transition-all duration-300"
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