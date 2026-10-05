import React from "react";
import { Link } from "react-router-dom";
import { Order } from "../services/api";

interface OrderCardProps {
  order: Order;
}

const getStatusStyle = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return "text-emerald-700 font-semibold";
    case "Cancelled":
      return "text-red-700 font-semibold";
    case "Shipped":
      return "text-blue-700 font-semibold";
    case "Processing":
    case "Confirmed":
      return "text-amber-700 font-semibold";
    default:
      return "text-zinc-700 font-semibold";
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        {/* Clean Unboxed Metadata with Typographic Separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-mono tabular-nums font-semibold text-zinc-900">
            {order._id}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span>
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          <span aria-hidden="true">·</span>
          <span className={getStatusStyle(order.status)}>
            Status: {order.status}
          </span>
        </div>

        <p className="text-sm font-medium text-zinc-900 line-clamp-1">
          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
        </p>

        <p className="text-xs text-zinc-500">
          Ship to: {order.shippingAddress.fullName},{" "}
          {order.shippingAddress.city}
        </p>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 shrink-0">
        <div className="text-left sm:text-right">
          <span className="block text-xs text-zinc-500">Total Amount</span>
          <span className="font-mono tabular-nums text-base font-semibold text-zinc-900">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap"
        >
          View Order
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
