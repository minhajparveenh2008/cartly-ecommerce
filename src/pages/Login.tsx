import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "";

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      if (loggedInUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (from && !from.startsWith("/admin")) {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail("user@cartly.com");
    setPassword("user123");
    setError(null);
  };

  const fillDemoAdmin = () => {
    setEmail("admin@cartly.com");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs font-medium text-zinc-500">Account Access</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-zinc-900">
            Sign in to Cartly
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Enter your credentials to access your orders or store dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials Helper for Internship Evaluation */}
        <div className="pt-5 border-t border-zinc-100 space-y-2.5">
          <span className="block text-[11px] font-medium text-zinc-500">
            Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="py-2 px-3 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-2 px-3 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 pt-2">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-zinc-900 hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
