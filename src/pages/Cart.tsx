import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";

export const Cart: React.FC = () => {
  const { cartItems, subtotal, total, totalItems, clearCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-10 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Administrator Account Active
          </h1>
          <p className="text-sm text-zinc-600">
            Administrators manage products and customer orders and cannot
            perform customer checkout actions.
          </p>
          <Link
            to="/admin"
            className="inline-block px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-5 h-5 text-zinc-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Your cart is empty.
          </h1>
          <p className="text-sm text-zinc-600 max-w-sm mx-auto">
            Start shopping to add products.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Order Review
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            Shopping Cart ({totalItems})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium text-zinc-500 hover:text-red-600 underline underline-offset-4 cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6">
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-zinc-900">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-mono tabular-nums font-medium text-zinc-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span>Standard Shipping</span>
              <span className="text-emerald-700 font-medium">Free</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-zinc-900">Total</span>
            <span className="font-mono tabular-nums text-xl font-semibold text-zinc-900">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="w-full py-3 px-5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="block text-center text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
