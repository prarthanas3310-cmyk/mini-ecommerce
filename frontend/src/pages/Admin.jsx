import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", category: "", image: "", stock: "" };
const emptyCoupon = { code: "", discountPercent: "" };

const statusColors = {
  pending: "bg-marigold-100 text-marigold-600",
  processing: "bg-teal-50 text-teal-600",
  shipped: "bg-teal-100 text-teal-700",
  delivered: "bg-teal-500 text-white",
  cancelled: "bg-clay/10 text-clay",
};

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Products */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-5">
          {editingId ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit} className="card p-5 space-y-3 mb-8">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="input-field" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input-field" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="input-field" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input-field" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input-field" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required className="input-field" />

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="font-display text-lg font-medium text-ink mb-3">Products</h2>
        <div className="space-y-2 mb-10">
          {products.map((p) => (
            <div key={p._id} className="card p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-ink truncate">{p.name}</p>
                <span className="price-tag mt-1">₹{p.price}</span>
              </div>
              <div className="flex gap-3 text-sm shrink-0">
                <button onClick={() => handleEdit(p)} className="text-teal-600 font-medium hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-clay font-medium hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupons */}
        <h1 className="font-display text-2xl font-semibold text-ink mb-5">Coupons</h1>
        <form onSubmit={handleCouponSubmit} className="card p-5 flex gap-2 mb-5">
          <input
            name="code"
            placeholder="CODE"
            value={couponForm.code}
            onChange={handleCouponChange}
            required
            className="input-field flex-1"
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
            className="input-field w-24"
          />
          <button type="submit" disabled={savingCoupon} className="btn-primary shrink-0">
            {savingCoupon ? "..." : "Create"}
          </button>
        </form>

        <div className="space-y-2">
          {coupons.length === 0 ? (
            <p className="text-ink/50 text-sm">No coupons yet.</p>
          ) : (
            coupons.map((c) => (
              <div key={c._id} className="card p-3 flex items-center justify-between">
                <span className="font-mono text-sm">
                  {c.code} — <span className="text-teal-600">{c.discountPercent}% off</span>
                </span>
                <button
                  onClick={() => handleCouponDelete(c._id)}
                  className="text-clay text-sm font-medium hover:underline"
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
        <h1 className="font-display text-2xl font-semibold text-ink mb-5">Orders</h1>
        {orders.length === 0 ? (
          <p className="text-ink/50 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-sm text-ink/60">
                    #{order._id.slice(-6)} — {order.user?.name || "Customer"}
                  </p>
                  <span className="price-tag">₹{order.totalAmount?.toFixed(2)}</span>
                </div>

                <div className="border-t border-ink/10 py-2 mb-2 space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-ink/60">
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
                  <p className="text-xs text-teal-600 mb-2">
                    Coupon: {order.couponCode} (−₹{order.discountAmount?.toFixed(2)})
                  </p>
                )}

                {order.shippingAddress && (
                  <p className="text-xs text-ink/40 mb-2">
                    {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                )}

                <select
                  value={order.status || "pending"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`text-xs font-mono font-medium px-2.5 py-1.5 rounded-md capitalize border-0 ${
                    statusColors[order.status] || "bg-ink/10 text-ink/60"
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
  );
}
