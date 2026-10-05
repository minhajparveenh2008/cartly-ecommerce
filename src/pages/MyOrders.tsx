import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import api, { Order } from "../services/api";
import OrderCard from "../components/OrderCard";

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Customer Account
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            My Orders
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-4"
        >
          Shop More Products
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-xl p-6 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
            <Package className="w-5 h-5 text-zinc-600" />
          </div>
          <h2 className="font-display text-xl font-semibold text-zinc-900">
            No orders placed yet
          </h2>
          <p className="text-sm text-zinc-600 max-w-sm mx-auto">
            When you place an order, its status and tracking timeline will
            appear here.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
