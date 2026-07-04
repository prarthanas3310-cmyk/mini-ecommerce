import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import OrderTimeline from "../components/OrderTimeline";

const statusColors = {
  pending: "bg-orange-400/10 text-orange-400 border border-orange-400/20",
  processing: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  shipped: "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20",
  delivered: "bg-green-400/10 text-green-400 border border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border border-red-400/20",
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
      <div className="min-h-screen bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-[#171717] border border-[#2C2C2C] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4">
          <EmptyState
            icon={PackageOpen}
            title="No orders yet"
            message="Once you place an order, it'll show up here."
            action={
              <Link
                to="/"
                className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#E6C75C] transition-all duration-300"
              >
                Start shopping
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <span className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
          Order history
        </span>

        <h1 className="text-3xl font-bold text-white mt-3 mb-8">My Orders</h1>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#171717] border border-[#2C2C2C] rounded-2xl p-5 sm:p-6 hover:border-[#D4AF37]/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-400 mb-1">
                    #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
                    statusColors[order.status] ||
                    "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </div>

              <div className="border-t border-[#2C2C2C] py-4">
                <OrderTimeline status={order.status} />
              </div>

              <div className="border-t border-[#2C2C2C] pt-4 space-y-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-300">
                      {item.name}{" "}
                      <span className="text-gray-500">× {item.quantity}</span>
                    </span>
                    <span className="font-mono text-gray-400">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-[#D4AF37] pt-3">
                  <span>Coupon ({order.couponCode})</span>
                  <span className="font-mono">
                    −₹{order.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="border-t border-[#2C2C2C] mt-4 pt-4 flex items-center justify-between">
                {order.status === "pending" ? (
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={cancellingId === order._id}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline disabled:opacity-50"
                  >
                    {cancellingId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                ) : (
                  <span />
                )}
                <span className="text-lg font-bold text-[#D4AF37]">
                  ₹{order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}