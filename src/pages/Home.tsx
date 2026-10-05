import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api, { Product } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";

const CATEGORY_CARDS = [
  {
    name: "Electronics",
    description: "Studio audio, tactile keyboards, and high-speed storage.",
    image: "/src/assets/images/product_electronics_headphones_1791220188656.jpg",
  },
  {
    name: "Accessories",
    description: "Field watches, leather goods, and desk accessories.",
    image: "/src/assets/images/product_accessories_watch_1791220201434.jpg",
  },
  {
    name: "Home",
    description: "Warm architectural lighting, ceramics, and workspace mats.",
    image: "/src/assets/images/product_home_lamp_1791220213800.jpg",
  },
  {
    name: "Lifestyle",
    description: "Weather-resistant carry, insulated drinkware, and stationery.",
    image: "/src/assets/images/product_lifestyle_backpack_1791220225640.jpg",
  },
];

const WHY_CARTLY = [
  {
    number: "01. Easy Shopping",
    description:
      "Browse a focused catalog with instant search and straightforward category, price, and availability filters.",
  },
  {
    number: "02. Secure Accounts",
    description:
      "Protected customer and administrator accounts using encrypted passwords and token-based session authentication.",
  },
  {
    number: "03. Simple Checkout",
    description:
      "Streamlined shipping verification with Cash on Delivery and Demo Payment support and automatic stock updates.",
  },
  {
    number: "04. Order Tracking",
    description:
      "Clear step-by-step order status updates from Pending and Confirmed through Processing, Shipped, and Delivered.",
  },
];

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const all = await api.products.getAll();
        setFeaturedProducts(all.slice(0, 6));
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-medium text-zinc-500 tracking-wide">
                Cartly · Simple shopping. Better experience.
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 tracking-tight leading-[1.12] max-w-xl">
                Everything you need, in one place.
              </h1>

              <p className="text-base text-zinc-600 leading-relaxed max-w-lg">
                Thoughtfully designed electronics, everyday accessories, home
                objects, and commute essentials built for reliable daily use.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="px-5 py-3 text-sm font-medium text-zinc-800 hover:text-zinc-950 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 transition-colors whitespace-nowrap"
                >
                  Explore Categories
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#F3F2EE] border border-zinc-200/80">
                <ProductImage
                  src="/src/assets/images/hero_storefront_showcase_1791220177832.jpg"
                  alt="Cartly curated collection of headphones, desk lamp, watch, and everyday essentials"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-zinc-500 mb-1">
              Curated Selection
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800 hover:text-zinc-950 underline underline-offset-4 whitespace-nowrap"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Browse by Department
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div className="aspect-[4/3] bg-[#F3F2EE] overflow-hidden">
                <ProductImage
                  src={cat.image}
                  alt={cat.name}
                  category={cat.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-900">
                  <span>Shop {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Cartly Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 sm:p-10">
          <div className="max-w-xl mb-8">
            <p className="text-xs font-medium text-zinc-500 mb-1">
              Store Standards
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
              Why Cartly?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-zinc-100">
            {WHY_CARTLY.map((item) => (
              <div key={item.number} className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {item.number}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
