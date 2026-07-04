import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", category: "", image: "", stock: "" };
const emptyCoupon = { code: "", discountPercent: "" };

const statusColors = {
  pending: "bg-orange-400/10 text-orange-400 border border-orange-400/20",
  processing: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  shipped: "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20",
  delivered: "bg-green-400/10 text-green-400 border border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border border-red-400/20",
};

const inputClass =
  "w-full bg-[#0D0D0D] border border-[#2C2C2C] rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors duration-200";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);

  const loadProducts = () => api.get("/products").then(({ data }) => setProducts(data));
  const loadOrders = () => api.get("/orders").then(({ data }) => setOrders(data));
  const loadCoupons = () => api.get("/coupons").then(({ data }) => setCoupons(data));

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCoupons();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast("Product deleted", { icon: "🗑️" });
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.success("Order status updated");
    loadOrders();
  };

  const handleCouponChange = (e) =>
    setCouponForm({ ...couponForm, [e.target.name]: e.target.value });

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setSavingCoupon(true);
    try {
      await api.post("/coupons", {
        code: couponForm.code,
        discountPercent: Number(couponForm.discountPercent),
      });
      toast.success("Coupon created");
      setCouponForm(emptyCoupon);
      loadCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create coupon");
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleCouponDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`);
    toast("Coupon deleted", { icon: "🗑️" });
    loadCoupons();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Products */}
        <div>
          <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
            Inventory
          </span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-6">
            {editingId ? "Edit Product" : "Add Product"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-6 space-y-4 mb-10"
          >
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className={inputClass} />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className={inputClass} />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className={inputClass} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className={inputClass} />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className={inputClass} />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required className={inputClass} />

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-semibold py-3 rounded-xl hover:bg-[#E6C75C] transition-all duration-300 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="border border-[#2C2C2C] text-white font-semibold px-5 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2 className="text-lg font-bold text-white mb-4">Products</h2>
          <div className="space-y-3 mb-12">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-[#D4AF37]/40 transition-colors duration-300"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{p.name}</p>
                  <span className="text-[#D4AF37] font-bold mt-1 inline-block">
                    ₹{p.price}
                  </span>
                </div>
                <div className="flex gap-4 text-sm shrink-0">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-[#D4AF37] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-400 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupons */}
          <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
            Promotions
          </span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-6">Coupons</h1>

          <form
            onSubmit={handleCouponSubmit}
            className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-5 flex gap-3 mb-6"
          >
            <input
              name="code"
              placeholder="CODE"
              value={couponForm.code}
              onChange={handleCouponChange}
              required
              className={`${inputClass} flex-1`}
            />
            <input
              name="discountPercent"
              type="number"
              placeholder="% off"
              min="1"
              max="90"
              value={couponForm.discountPercent}
              onChange={handleCouponChange}
              required
              className={`${inputClass} w-24`}
            />
            <button
              type="submit"
              disabled={savingCoupon}
              className="shrink-0 bg-[#D4AF37] text-black font-semibold px-5 rounded-xl hover:bg-[#E6C75C] transition-all duration-300 disabled:opacity-50"
            >
              {savingCoupon ? "..." : "Create"}
            </button>
          </form>

          <div className="space-y-3">
            {coupons.length === 0 ? (
              <p className="text-gray-500 text-sm">No coupons yet.</p>
            ) : (
              coupons.map((c) => (
                <div
                  key={c._id}
                  className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-4 flex items-center justify-between"
                >
                  <span className="font-mono text-sm text-gray-300">
                    {c.code} —{" "}
                    <span className="text-[#D4AF37]">{c.discountPercent}% off</span>
                  </span>
                  <button
                    onClick={() => handleCouponDelete(c._id)}
                    className="text-red-400 text-sm font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders */}
        <div>
          <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
            Fulfilment
          </span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-6">Orders</h1>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-sm text-gray-400">
                      #{order._id.slice(-6)} — {order.user?.name || "Customer"}
                    </p>
                    <span className="text-lg font-bold text-[#D4AF37]">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-[#2C2C2C] py-3 mb-3 space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-gray-400"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-mono">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.couponCode && (
                    <p className="text-xs text-[#D4AF37] mb-2">
                      Coupon: {order.couponCode} (−₹{order.discountAmount?.toFixed(2)})
                    </p>
                  )}

                  {order.shippingAddress && (
                    <p className="text-xs text-gray-500 mb-3">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                  )}

                  <select
                    value={order.status || "pending"}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg capitalize bg-[#0D0D0D] focus:outline-none ${
                      statusColors[order.status] ||
                      "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}