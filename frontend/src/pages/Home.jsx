import { useEffect, useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import EmptyState from "../components/EmptyState";
import ProductStrip from "../components/ProductStrip";
import { getRecentlyViewed } from "../utils/recentlyViewed";
import logo from "../assets/parzen-logo.png";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(getRecentlyViewed());
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api
      .get("/products")
      .then(({ data }) => {
        if (mounted) setProducts(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...set];
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);

    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);

    if (sort === "name")
      list = [...list].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    return list;
  }, [products, search, category, sort]);

  return (
    <div className="bg-[#0D0D0D] min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}

        <div className="mb-12 rounded-3xl overflow-hidden border border-[#2C2C2C] bg-gradient-to-r from-black via-[#111] to-[#1b1b1b] shadow-2xl">

          <div className="flex flex-col lg:flex-row items-center justify-between px-10 py-14">

            <div className="max-w-xl">

              <p className="uppercase tracking-[5px] text-[#D4AF37] text-sm mb-3">
                Premium Shopping Experience
              </p>

              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Elevate Your
                <span className="block text-[#D4AF37]">
                  Shopping Style
                </span>
              </h1>

              <p className="mt-6 text-gray-400 text-lg leading-8">
                Discover handpicked premium products designed for elegance,
                quality, and everyday luxury.
              </p>

             <button
  onClick={() =>
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="mt-8 bg-[#D4AF37] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#E6C75C] transition duration-300 shadow-lg"
>
  Explore Collection
</button>

            </div>

            <div className="flex items-center justify-center mt-8 lg:mt-0">

              <img
                src={logo}
                alt="PARZEN"
                className="w-40 sm:w-56 lg:w-80 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-transform duration-500 hover:scale-105"
              />

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="relative mb-8">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
          />

          <input
            type="text"
            placeholder="Search premium products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#171717] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition duration-300"
          />

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

          <div className="flex flex-wrap gap-3">

            {categories.map((cat) => (

              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                  category === cat
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "bg-[#171717] text-gray-300 border-[#2C2C2C] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
              >
                {cat}
              </button>

            ))}

          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#171717] border border-[#2C2C2C] rounded-lg px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price : Low to High</option>
            <option value="price-desc">Price : High to Low</option>
            <option value="name">Name : A-Z</option>
          </select>

        </div>

        {/* PRODUCTS */}

        {loading ? (

          <div 
         
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}

          </div>

        ) : visibleProducts.length === 0 ? (

          <EmptyState
            icon={PackageSearch}
            title="No products found"
            message={
              search
                ? `Nothing matches "${search}".`
                : "No products available."
            }
          />

        ) : (

          <div
  id="products"
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
>

            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

        <div className="mt-16">
          <ProductStrip
            title="Recently Viewed"
            products={recent}
          />
        </div>

      </div>

    </div>
  );
}