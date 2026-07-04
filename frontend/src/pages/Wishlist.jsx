import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Tap the heart on any product to save it here for later."
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

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
          Saved for later
        </span>

        <h1 className="text-3xl font-bold text-white mt-3 mb-8">
          Your Wishlist{" "}
          <span className="text-gray-500 font-normal text-xl">
            ({wishlist.length})
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}