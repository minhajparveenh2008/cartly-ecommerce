import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api, { Product, Order } from "../services/api";

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodData, orderData] = await Promise.all([
          api.products.getAll(),
          api.orders.getAll(),
        ]);
        setProducts(prodData);
        setOrders(orderData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Store Administration
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Simple Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <span className="block text-xs font-medium text-zinc-500">
            Total Products
          </span>
          <span className="mt-2 block font-mono tabular-nums text-3xl font-semibold text-zinc-900">
            {loading ? "—" : totalProducts}
          </span>
          <Link
            to="/admin/products"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
          >
            <span>View catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <span className="block text-xs font-medium text-zinc-500">
            Total Orders
          </span>
          <span className="mt-2 block font-mono tabular-nums text-3xl font-semibold text-zinc-900">
            {loading ? "—" : totalOrders}
          </span>
          <Link
            to="/admin/orders"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
          >
            <span>All orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <span className="block text-xs font-medium text-zinc-500">
            Pending Orders
          </span>
          <span className="mt-2 block font-mono tabular-nums text-3xl font-semibold text-amber-700">
            {loading ? "—" : pendingOrders}
          </span>
          <span className="mt-4 block text-xs text-zinc-500">
            Awaiting confirmation
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <span className="block text-xs font-medium text-zinc-500">
            Delivered Orders
          </span>
          <span className="mt-2 block font-mono tabular-nums text-3xl font-semibold text-emerald-700">
            {loading ? "—" : deliveredOrders}
          </span>
          <span className="mt-4 block text-xs text-zinc-500">
            Completed shipments
          </span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Recent Orders
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Latest customer orders across the store
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-medium text-zinc-800 hover:text-zinc-950 underline underline-offset-4"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold text-zinc-600">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-zinc-500">
                    Loading recent orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-zinc-500">
                    No customer orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/60">
                    <td className="py-4 px-6 font-mono tabular-nums text-xs font-semibold text-zinc-900">
                      {order._id}
                    </td>
                    <td className="py-4 px-6 text-zinc-800">
                      {order.userDetails?.name ||
                        order.shippingAddress.fullName}
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
                    <td className="py-4 px-6 text-xs font-semibold text-zinc-800">
                      {order.status}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-xs font-medium text-zinc-900 hover:underline underline-offset-4"
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

export default AdminDashboard;
