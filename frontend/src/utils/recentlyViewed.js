const KEY = "recentlyViewed";
const MAX_ITEMS = 8;

export function addRecentlyViewed(product) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = stored.filter((p) => p._id !== product._id);
    const updated = [
      { _id: product._id, name: product.name, price: product.price, image: product.image, category: product.category, stock: product.stock },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function getRecentlyViewed(excludeId) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    return excludeId ? stored.filter((p) => p._id !== excludeId) : stored;
  } catch {
    return [];
  }
}
