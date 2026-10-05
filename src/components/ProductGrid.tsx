import React from "react";
import { Product } from "../services/api";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = "No products match your current search or filter criteria.",
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-zinc-200 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-zinc-100" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-zinc-100 rounded w-1/3" />
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 rounded w-full" />
              <div className="pt-4 flex gap-2">
                <div className="h-8 bg-zinc-100 rounded flex-1" />
                <div className="h-8 bg-zinc-100 rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <h3 className="text-base font-semibold text-zinc-900">
          No Products Found
        </h3>
        <p className="mt-1.5 text-sm text-zinc-600 max-w-md mx-auto">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
