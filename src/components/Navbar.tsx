import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, notification, dismissNotification } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
      isActive(path)
        ? "text-zinc-900 border-zinc-900"
        : "text-zinc-600 border-transparent hover:text-zinc-900 hover:border-zinc-300"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="font-display text-2xl font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0"
          >
            Cartly
          </Link>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7">
            {isAdmin ? (
              <>
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className={navLinkClass("/admin/products")}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className={navLinkClass("/admin/orders")}
                >
                  Orders
                </Link>
                <Link to="/products" className={navLinkClass("/products")}>
                  Storefront
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={navLinkClass("/")}>
                  Home
                </Link>
                <Link to="/products" className={navLinkClass("/products")}>
                  Shop
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-zinc-300"
                >
                  Categories
                </Link>
                {user && (
                  <Link to="/my-orders" className={navLinkClass("/my-orders")}>
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {!isAdmin && (
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-800 hover:text-zinc-950 border border-zinc-200 rounded-lg bg-white hover:border-zinc-300 transition-colors whitespace-nowrap"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="font-mono tabular-nums text-xs font-semibold text-zinc-900">
                  ({totalItems})
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-950 transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            {!isAdmin && (
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-900 border border-zinc-200 rounded-lg bg-white whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-mono tabular-nums">({totalItems})</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-zinc-700 hover:text-zinc-950 border border-zinc-200 rounded-lg bg-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <div className="flex flex-col space-y-2">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-600"
                  >
                    View Storefront
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Shop All Products
                  </Link>
                  <Link
                    to="/products?category=Electronics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-600"
                  >
                    Categories
                  </Link>
                  {user && (
                    <Link
                      to="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-sm font-medium text-zinc-900"
                    >
                      My Orders
                    </Link>
                  )}
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-900"
                  >
                    Cart ({totalItems})
                  </Link>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-200 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm font-medium text-zinc-700"
                  >
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-sm font-medium text-zinc-900 border border-zinc-300 rounded-lg text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-sm font-medium text-zinc-800 border border-zinc-300 rounded-lg text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Non-intrusive Cart Feedback Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-lg border border-zinc-800 flex items-center justify-between gap-4 text-sm">
          <span>{notification}</span>
          <button
            onClick={dismissNotification}
            className="text-zinc-400 hover:text-white text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
