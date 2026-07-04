import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    api.get("/auth/wishlist").then(({ data }) => setWishlist(data));
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = (productId) =>
    wishlist.some((p) => p._id === productId);

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Log in to save items to your wishlist");
      return;
    }
    try {
      if (isWishlisted(product._id)) {
        const { data } = await api.delete(`/auth/wishlist/${product._id}`);
        setWishlist(data);
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        const { data } = await api.post(`/auth/wishlist/${product._id}`);
        setWishlist(data);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
