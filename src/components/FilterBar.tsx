import React from "react";

export const CATEGORIES = [
  "All",
  "Electronics",
  "Accessories",
  "Home",
  "Lifestyle",
] as const;

export const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: "", max: "" },
  { id: "under-50", label: "Under $50", min: "0", max: "50" },
  { id: "50-150", label: "$50 – $150", min: "50", max: "150" },
  { id: "over-150", label: "Over $150", min: "150", max: "" },
] as const;

export const AVAILABILITY_OPTIONS = [
  { id: "all", label: "All Items" },
  { id: "in-stock", label: "In Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
] as const;

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (rangeId: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (availability: string) => void;
  onReset: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedAvailability,
  onAvailabilityChange,
  onReset,
  totalCount,
}) => {
  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedPriceRange !== "all" ||
    selectedAvailability !== "all";

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Segmented Controls */}
        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-zinc-500">
            Category
          </span>
          <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-lg">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-white text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Availability Filters */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="price-filter"
              className="block text-xs font-medium text-zinc-500"
            >
              Price Range
            </label>
            <select
              id="price-filter"
              value={selectedPriceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="availability-filter"
              className="block text-xs font-medium text-zinc-500"
            >
              Availability
            </label>
            <select
              id="availability-filter"
              value={selectedAvailability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
        <span>
          Showing{" "}
          <strong className="font-mono tabular-nums text-zinc-900">
            {totalCount}
          </strong>{" "}
          {totalCount === 1 ? "product" : "products"}
        </span>
        {selectedCategory !== "All" && (
          <span>Filtered by {selectedCategory}</span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
