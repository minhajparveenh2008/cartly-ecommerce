import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Profile: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div>
            <p className="text-xs font-medium text-zinc-500">Account Profile</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-zinc-900">
              {user.name}
            </h1>
          </div>
          <span className="text-xs font-medium text-zinc-600">
            Role: <strong className="text-zinc-900 capitalize">{user.role}</strong>
          </span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <dt className="text-xs text-zinc-500">Full Name</dt>
            <dd className="mt-1 font-medium text-zinc-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Email Address</dt>
            <dd className="mt-1 font-medium text-zinc-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Account ID</dt>
            <dd className="mt-1 font-mono tabular-nums text-xs text-zinc-700">
              {user._id}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Member Since</dt>
            <dd className="mt-1 font-medium text-zinc-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Active Member"}
            </dd>
          </div>
        </dl>

        <div className="pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
          {isAdmin ? (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin"
                className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="px-4 py-2 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="px-4 py-2 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Manage Orders
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/my-orders"
                className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-medium text-red-700 hover:text-red-800 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
