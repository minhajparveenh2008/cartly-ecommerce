import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { Order, OrderStatus } from "../services/api";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      const updated = await api.orders.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
      setFeedback(`Order ${orderId} status updated to ${newStatus}.`);
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-1">
          Order Fulfillment
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
          Admin Orders ({orders.length})
        </h1>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold text-zinc-600">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-zinc-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-zinc-500"
                  >
                    No customer orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/60">
                    <td className="py-4 px-6 font-mono tabular-nums text-xs font-semibold text-zinc-900">
                      {order._id}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-zinc-900">
                        {order.userDetails?.name ||
                          order.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.userDetails?.email ||
                          order.shippingAddress.city}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 font-mono tabular-nums font-medium text-zinc-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        aria-label={`Update status for order ${order._id}`}
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value as OrderStatus
                          )
                        }
                        className="px-2.5 py-1.5 text-xs font-medium text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors whitespace-nowrap"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
