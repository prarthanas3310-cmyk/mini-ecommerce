import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="border rounded p-4 mb-3">
          <p>Order #{o._id.slice(-6)} — <span className="capitalize">{o.status}</span></p>
          <p>Total: ${o.totalAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
