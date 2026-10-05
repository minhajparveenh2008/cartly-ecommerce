import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || isAdmin) return;
    addToCart(product, 1);
  };

  return (
    <article className="group bg-white border border-zinc-200/90 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5">
      {/* Product Image Container (4:3 aspect ratio) */}
      <Link
        to={`/products/${product._id}`}
        className="block relative aspect-[4/3] bg-[#F3F2EE] overflow-hidden"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                inStock
                  ? "text-emerald-700 font-medium"
                  : "text-red-700 font-medium"
              }
            >
              {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-100">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs text-zinc-500">Price</span>
            <span className="font-mono tabular-nums text-base font-semibold text-zinc-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to={`/products/${product._id}`}
              className="py-2 px-3 text-xs font-medium text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-center transition-colors whitespace-nowrap"
            >
              View Details
            </Link>

            {isAdmin ? (
              <Link
                to="/admin/products"
                className="py-2 px-3 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-center transition-colors whitespace-nowrap"
              >
                Manage Item
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  inStock
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
