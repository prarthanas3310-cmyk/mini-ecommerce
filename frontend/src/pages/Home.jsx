import { useEffect, useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import EmptyState from "../components/EmptyState";
import ProductStrip from "../components/ProductStrip";
import { getRecentlyViewed } from "../utils/recentlyViewed";

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
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, category, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Filter chips + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-mono transition-colors border ${
                category === cat
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-ink/70 border-ink/15 hover:border-teal-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-ink/15 rounded-md px-2.5 py-1.5 bg-white text-ink/80"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              ? `Nothing matches "${search}". Try a different search or clear your filters.`
              : "There's nothing in this category yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <ProductStrip title="Recently Viewed" products={recent} />
    </div>
  );
}
