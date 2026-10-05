import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemType, useCart } from "../context/CartContext";
import ProductImage from "./ProductImage";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const itemSubtotal = Number((product.price * quantity).toFixed(2));
  const atMaxStock = quantity >= product.stock;

  return (
    <div className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/80 last:border-b-0">
      <div className="flex items-center gap-4">
        <Link
          to={`/products/${product._id}`}
          className="w-20 h-20 rounded-lg bg-[#F3F2EE] overflow-hidden shrink-0 border border-zinc-200/60"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
          />
        </Link>

        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              ${product.price.toFixed(2)} each
            </span>
          </div>
          <Link
            to={`/products/${product._id}`}
            className="mt-0.5 block text-sm sm:text-base font-semibold text-zinc-900 hover:text-zinc-700 transition-colors"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-zinc-500">
            Available stock:{" "}
            <span className="font-mono tabular-nums">{product.stock}</span>
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
          <button
            type="button"
            onClick={() => decreaseQuantity(product._id)}
            aria-label="Decrease quantity"
            className="p-2 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-mono tabular-nums font-semibold text-zinc-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => increaseQuantity(product._id)}
            disabled={atMaxStock}
            aria-label="Increase quantity"
            className={`p-2 transition-colors ${
              atMaxStock
                ? "text-zinc-300 cursor-not-allowed"
                : "text-zinc-700 hover:text-zinc-950 cursor-pointer"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Subtotal */}
        <div className="text-right min-w-[85px]">
          <span className="block text-[11px] text-zinc-400">Subtotal</span>
          <span className="font-mono tabular-nums text-sm font-semibold text-zinc-900">
            ${itemSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeFromCart(product._id)}
          aria-label={`Remove ${product.name} from cart`}
          className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
