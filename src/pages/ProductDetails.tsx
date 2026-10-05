import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import api, { Product } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/ProductImage";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.products.getById(id);
        setProduct(data);
        setQuantity(1);
      } catch (err: any) {
        setError(err.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[4/3] bg-zinc-200 rounded-xl" />
          <div className="space-y-4 py-4">
            <div className="h-4 bg-zinc-200 rounded w-1/4" />
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/5" />
            <div className="h-24 bg-zinc-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-10 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Product Not Found
          </h1>
          <p className="text-sm text-zinc-600">
            {error || "The requested product could not be located."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAdd = () => {
    if (!inStock || isAdmin) return;
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Contiguous Purchase Module (PDP) */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] rounded-xl bg-[#F3F2EE] overflow-hidden border border-zinc-200/70">
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
              />
            </div>
          </div>

          {/* Right: Purchase Module */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Clean Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-zinc-900 underline underline-offset-4"
                >
                  {product.category}
                </Link>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    inStock
                      ? "text-emerald-700 font-medium"
                      : "text-red-700 font-medium"
                  }
                >
                  {inStock
                    ? `In Stock (${product.stock} available)`
                    : "Out of Stock"}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-2xl font-semibold text-zinc-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-500">
                  Inclusive of all standard taxes
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <h2 className="text-xs font-semibold text-zinc-900 mb-2">
                Description
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Availability</span>
                <span className="font-mono tabular-nums font-medium text-zinc-900">
                  {inStock ? `${product.stock} units in warehouse` : "0 units"}
                </span>
              </div>

              {isAdmin ? (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                  <p className="text-xs text-zinc-600">
                    You are signed in as an Administrator. Customer cart and
                    checkout actions are disabled for admin accounts.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="w-full py-2.5 px-4 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit in Admin Products
                  </button>
                </div>
              ) : (
                <>
                  {/* Quantity Selector */}
                  {inStock && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-700">
                        Quantity
                      </span>
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          type="button"
                          onClick={handleDecrease}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                          className="p-2.5 text-zinc-700 hover:text-zinc-950 disabled:text-zinc-300 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-sm font-mono tabular-nums font-semibold text-zinc-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrease}
                          disabled={quantity >= product.stock}
                          aria-label="Increase quantity"
                          className="p-2.5 text-zinc-700 hover:text-zinc-950 disabled:text-zinc-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={!inStock}
                      className={`flex-1 py-3 px-5 text-sm font-medium rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                        inStock
                          ? "bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
                          : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {inStock
                          ? `Add to Cart — $${(product.price * quantity).toFixed(2)}`
                          : "Out of Stock"}
                      </span>
                    </button>

                    <Link
                      to="/cart"
                      className="py-3 px-5 text-sm font-medium text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-center transition-colors whitespace-nowrap"
                    >
                      View Cart
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
