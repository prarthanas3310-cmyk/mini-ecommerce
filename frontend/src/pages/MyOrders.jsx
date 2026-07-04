import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import OrderTimeline from "../components/OrderTimeline";

const statusColors = {
  pending: "bg-marigold-100 text-marigold-600",
  processing: "bg-teal-50 text-teal-600",
  shipped: "bg-teal-100 text-teal-700",
  delivered: "bg-teal-500 text-white",
  cancelled: "bg-clay/10 text-clay",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = () => {
    api
      .get("/orders/my")
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  };

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
          <div key={order._id} className="card p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="font-mono text-sm text-ink/50 mb-1">
                  #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-ink/40">
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

            <div className="border-t border-ink/10 py-3">
              <OrderTimeline status={order.status} />
            </div>

            <div className="border-t border-ink/10 pt-3 space-y-1.5">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">
                    {item.name} <span className="text-ink/40">× {item.quantity}</span>
                  </span>
                  <span className="font-mono text-ink/60">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {order.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-teal-600 pt-2">
                <span>Coupon ({order.couponCode})</span>
                <span className="font-mono">−₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-ink/10 mt-3 pt-3 flex items-center justify-between">
              {order.status === "pending" ? (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                  className="text-xs font-medium text-clay hover:underline"
                >
                  {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              ) : (
                <span />
              )}
              <span className="price-tag">₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
