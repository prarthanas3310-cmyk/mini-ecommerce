import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";

const statusColors = {
  pending: "bg-marigold-100 text-marigold-600",
  processing: "bg-teal-50 text-teal-600",
  shipped: "bg-teal-100 text-teal-700",
  delivered: "bg-teal-500 text-white",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg skeleton" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          message="Once you place an order, it'll show up here."
          action={
            <Link to="/" className="btn-primary">
              Start shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">My Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-ink/50 mb-1">
                #{order._id.slice(-6)}
              </p>
              <span className="price-tag">₹{order.totalPrice?.toFixed(2)}</span>
              <p className="text-xs text-ink/40 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full capitalize ${
                statusColors[order.status] || "bg-ink/10 text-ink/60"
              }`}
            >
              {order.status || "pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
