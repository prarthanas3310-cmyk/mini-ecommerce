import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", image: "", stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/orders").then((res) => setOrders(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }
    setForm({ name: "", description: "", price: "", category: "", image: "", stock: "" });
    setEditingId(null);
    loadData();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price,
      category: p.category, image: p.image, stock: p.stock });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadData();
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit" : "Add"} Product</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {["name", "description", "price", "category", "image", "stock"].map((field) => (
            <input
              key={field}
              className="border p-2 w-full"
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <button className="bg-black text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"} Product
          </button>
        </form>

        <h3 className="font-bold mt-6 mb-2">Products</h3>
        {products.map((p) => (
          <div key={p._id} className="flex justify-between items-center border-b py-2">
            <span>{p.name} — ${p.price}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Orders</h2>
        {orders.map((o) => (
          <div key={o._id} className="border rounded p-3 mb-3">
            <p>#{o._id.slice(-6)} — {o.user?.name} — ${o.totalAmount.toFixed(2)}</p>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
              className="border p-1 mt-2"
            >
              {["pending", "processing", "shipped", "delivered"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
