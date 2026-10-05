import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="font-display text-xl font-semibold text-zinc-900 tracking-tight"
            >
              Cartly
            </Link>
            <p className="mt-2 text-sm text-zinc-600 max-w-sm leading-relaxed">
              Simple shopping. Better experience. Thoughtfully selected
              electronics, everyday accessories, home goods, and lifestyle
              essentials.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-900 tracking-wide mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <Link
                  to="/products?category=Electronics"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Accessories"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Home"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Lifestyle"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-900 tracking-wide mb-3">
              Account & Orders
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <Link
                  to="/products"
                  className="hover:text-zinc-900 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Account Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Cartly. All rights reserved.</p>
          <p>Cash on Delivery & Demo Checkout Enabled</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
