import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api, { Product } from "../services/api";
import SearchBar from "../components/SearchBar";
import FilterBar, { PRICE_RANGES } from "../components/FilterBar";
import ProductGrid from "../components/ProductGrid";

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("all");

  useEffect(() => {
    const catFromUrl = searchParams.get("category") || "All";
    setSelectedCategory(catFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setSelectedAvailability("all");
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search by name or category
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      // Filter by category
      if (
        selectedCategory !== "All" &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Filter by price range
      const priceObj = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (priceObj) {
        if (priceObj.min !== "" && product.price < Number(priceObj.min)) {
          return false;
        }
        if (priceObj.max !== "" && product.price > Number(priceObj.max)) {
          return false;
        }
      }

      // Filter by availability
      if (selectedAvailability === "in-stock" && product.stock <= 0) {
        return false;
      }
      if (selectedAvailability === "out-of-stock" && product.stock > 0) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    selectedAvailability,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Cartly Catalog
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            All Products
          </h1>
        </div>
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by product name or category..."
          />
        </div>
      </div>

      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        selectedAvailability={selectedAvailability}
        onAvailabilityChange={setSelectedAvailability}
        onReset={handleResetFilters}
        totalCount={filteredProducts.length}
      />

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
};

export default Products;
