import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api, { Order } from "../services/api";

export const Checkout: React.FC = () => {
  const { cartItems, subtotal, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>(user?.name || "");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>(
    "Cash on Delivery / Demo Payment"
  );

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 sm:p-10 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-emerald-700">
              Order Confirmed
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
              Thank you for your order
            </h1>
            <p className="text-sm text-zinc-600">
              Order{" "}
              <span className="font-mono tabular-nums font-semibold text-zinc-900">
                {confirmedOrder._id}
              </span>{" "}
              has been placed and is now{" "}
              <span className="font-medium text-zinc-900">
                {confirmedOrder.status}
              </span>
              .
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-4 text-left text-xs text-zinc-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Recipient:</span>
              <span className="font-medium text-zinc-900">
                {confirmedOrder.shippingAddress.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium text-zinc-900">
                {confirmedOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-mono tabular-nums font-semibold text-zinc-900">
                ${confirmedOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/orders/${confirmedOrder._id}`)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Track Order Details
            </button>
            <Link
              to="/my-orders"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              View All My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-10 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Your cart is empty
          </h1>
          <p className="text-sm text-zinc-600">
            Add products to your shopping cart before proceeding to checkout.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const validateShipping = (): string | null => {
    if (fullName.trim().length < 2) return "Please enter your full name.";
    if (address.trim().length < 5)
      return "Please enter a complete street address.";
    if (city.trim().length < 2) return "Please enter a valid city.";
    if (state.trim().length < 2) return "Please enter a valid state.";
    if (postalCode.trim().length < 3)
      return "Please enter a valid postal code.";
    if (phone.trim().length < 7)
      return "Please enter a valid contact phone number.";
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateShipping();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.image,
          price: i.product.price,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          phone: phone.trim(),
        },
        paymentMethod,
      };

      const created = await api.orders.create(orderPayload);
      clearCart();
      setConfirmedOrder(created);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Shipping Details & Payment */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Shipping Address
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Enter the delivery destination for your order.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-zinc-700 mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs font-medium text-zinc-700 mb-1.5"
              >
                Address *
              </label>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, suite"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Postal Code *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560038"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              Payment Method
            </h2>
            <label className="flex items-start gap-3 p-4 border border-zinc-900 bg-zinc-50/70 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery / Demo Payment"
                checked={paymentMethod === "Cash on Delivery / Demo Payment"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 accent-zinc-900"
              />
              <div>
                <span className="block text-sm font-semibold text-zinc-900">
                  Cash on Delivery / Demo Payment
                </span>
                <span className="block text-xs text-zinc-500 mt-0.5">
                  No real payment card required. Order is created immediately in
                  the database and product stock is updated.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-semibold text-zinc-900">
            Order Summary
          </h2>

          <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-mono tabular-nums font-medium text-zinc-900 shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums font-medium text-zinc-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shipping</span>
              <span className="text-emerald-700 font-medium">Free</span>
            </div>
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
              <span className="font-semibold text-zinc-900">Total</span>
              <span className="font-mono tabular-nums text-xl font-semibold text-zinc-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
