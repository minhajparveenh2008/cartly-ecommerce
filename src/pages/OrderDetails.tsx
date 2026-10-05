import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import api, { Order, OrderStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/ProductImage";

const TIMELINE_STEPS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.orders.getById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Order not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const updated = await api.orders.updateStatus(order._id, newStatus);
      setOrder(updated);
      setStatusMessage(`Order status updated to ${newStatus}.`);
    } catch (err: any) {
      setStatusMessage(err.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 h-96 animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-10 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Order Unavailable
          </h1>
          <p className="text-sm text-zinc-600">
            {error || "Could not load order details."}
          </p>
          <Link
            to={isAdmin ? "/admin/orders" : "/my-orders"}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to={isAdmin ? "/admin/orders" : "/my-orders"}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAdmin ? "Back to All Orders" : "Back to My Orders"}</span>
        </Link>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span>Order Date: {formattedDate}</span>
              <span aria-hidden="true">·</span>
              <span>Payment: {order.paymentMethod}</span>
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
              Order{" "}
              <span className="font-mono tabular-nums">{order._id}</span>
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="block text-xs text-zinc-500">Current Status</span>
            <span
              className={`text-base font-semibold ${
                order.status === "Delivered"
                  ? "text-emerald-700"
                  : order.status === "Cancelled"
                  ? "text-red-700"
                  : "text-zinc-900"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Status Control Bar */}
      {isAdmin && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Administrator Status Control
            </h2>
            <p className="text-xs text-zinc-500">
              Update the fulfillment stage for this customer order.
            </p>
            {statusMessage && (
              <p className="mt-1 text-xs font-medium text-emerald-700">
                {statusMessage}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="admin-status-select" className="sr-only">
              Order Status
            </label>
            <select
              id="admin-status-select"
              value={order.status}
              disabled={updatingStatus}
              onChange={(e) =>
                handleStatusChange(e.target.value as OrderStatus)
              }
              className="px-3.5 py-2 text-xs font-medium text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items & Shipping Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Ordered Items */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-zinc-900">
              Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <div className="divide-y divide-zinc-100">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.product}-${idx}`}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/products/${item.product}`}
                      className="w-16 h-16 rounded-lg bg-[#F3F2EE] overflow-hidden shrink-0 border border-zinc-200/60"
                    >
                      <ProductImage src={item.image} alt={item.name} />
                    </Link>
                    <div>
                      <Link
                        to={`/products/${item.product}`}
                        className="text-sm font-semibold text-zinc-900 hover:underline underline-offset-4"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono tabular-nums">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono tabular-nums text-sm font-semibold text-zinc-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-200 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-zinc-900">
                Order Total
              </span>
              <span className="font-mono tabular-nums text-lg font-semibold text-zinc-900">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 mb-2">
                Shipping Address
              </h3>
              <div className="text-xs text-zinc-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-zinc-900">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="pt-1 font-mono tabular-nums">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-900 mb-2">
                Payment & Fulfillment
              </h3>
              <div className="text-xs text-zinc-600 space-y-1.5">
                <p>
                  Method:{" "}
                  <strong className="text-zinc-900">
                    {order.paymentMethod}
                  </strong>
                </p>
                <p>
                  Order ID:{" "}
                  <span className="font-mono tabular-nums text-zinc-900">
                    {order._id}
                  </span>
                </p>
                <p>
                  Last Updated:{" "}
                  <span className="text-zinc-900">
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Tracking Timeline */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Order Tracking
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Step-by-step fulfillment status
            </p>
          </div>

          {isCancelled ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
              <p className="font-semibold">Order Cancelled</p>
              <p>
                This order has been cancelled and reserved product stock has
                been restored.
              </p>
            </div>
          ) : (
            <div className="pt-2">
              {TIMELINE_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isLast = index === TIMELINE_STEPS.length - 1;

                return (
                  <div key={step} className="flex flex-col">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold border transition-colors ${
                          isCurrent
                            ? "bg-zinc-900 text-white border-zinc-900 ring-4 ring-zinc-900/10"
                            : isCompleted
                            ? "bg-emerald-700 text-white border-emerald-700"
                            : "bg-zinc-50 text-zinc-400 border-zinc-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={`text-sm ${
                            isCurrent
                              ? "font-semibold text-zinc-900"
                              : isCompleted
                              ? "font-medium text-zinc-800"
                              : "text-zinc-400"
                          }`}
                        >
                          {step}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] font-medium text-emerald-700">
                            Current Stage
                          </span>
                        )}
                      </div>
                    </div>

                    {!isLast && (
                      <div className="ml-3.5 my-1.5 pl-3.5 border-l-2 border-zinc-200 h-5 flex items-center">
                        <span className="text-[10px] text-zinc-300 select-none">
                          ↓
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
