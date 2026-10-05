import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api, { Product } from "../services/api";
import ProductImage from "../components/ProductImage";

const CATEGORIES: Product["category"][] = [
  "Electronics",
  "Accessories",
  "Home",
  "Lifestyle",
];

const SAMPLE_IMAGE_PRESETS = [
  {
    label: "Studio Wireless Headphones",
    url: "/src/assets/images/product_electronics_headphones_1791220188656.jpg",
  },
  {
    label: "Minimalist Field Watch",
    url: "/src/assets/images/product_accessories_watch_1791220201434.jpg",
  },
  {
    label: "Opal Glass Table Lamp",
    url: "/src/assets/images/product_home_lamp_1791220213800.jpg",
  },
  {
    label: "Waxed Canvas Backpack",
    url: "/src/assets/images/product_lifestyle_backpack_1791220225640.jpg",
  },
  { label: "Mechanical Keyboard", url: "/images/products/keyboard.svg" },
  { label: "Portable SSD", url: "/images/products/ssd.svg" },
  { label: "Leather Cardholder", url: "/images/products/cardholder.svg" },
  { label: "Ceramic Pour-Over Set", url: "/images/products/pourover.svg" },
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add / Edit Form State
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<Product["category"]>("Electronics");
  const [image, setImage] = useState<string>(SAMPLE_IMAGE_PRESETS[0].url);
  const [stock, setStock] = useState<string>("10");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Electronics");
    setImage(SAMPLE_IMAGE_PRESETS[0].url);
    setStock("15");
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image);
    setStock(String(product.stock));
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
    setFormError(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !description.trim() || !image.trim()) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setFormError("Price must be a valid number greater than 0.");
      return;
    }

    if (
      Number.isNaN(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {
      setFormError("Stock must be a non-negative integer.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        const updated = await api.products.update(editingProduct._id, {
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          category,
          image: image.trim(),
          stock: numericStock,
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        setFeedback(`Updated "${updated.name}" successfully.`);
      } else {
        const created = await api.products.create({
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          category,
          image: image.trim(),
          stock: numericStock,
        });
        setProducts((prev) => [created, ...prev]);
        setFeedback(`Added "${created.name}" to catalog.`);
      }
      closeForm();
    } catch (err: any) {
      setFormError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await api.products.delete(productToDelete._id);
      setProducts((prev) =>
        prev.filter((p) => p._id !== productToDelete._id)
      );
      setFeedback(`Deleted "${productToDelete.name}".`);
      setProductToDelete(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-1">
            Catalog Management
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            Admin Products ({products.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add / Edit Product Form Panel */}
      {formOpen && (
        <div className="bg-white border border-zinc-300 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h2 className="font-display text-xl font-semibold text-zinc-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prod-name"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Studio Wireless Headphones"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="prod-category"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Category *
                </label>
                <select
                  id="prod-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Product["category"])
                  }
                  className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prod-price"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Price (USD) *
                </label>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="149.00"
                  className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="prod-stock"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Stock Quantity *
                </label>
                <input
                  id="prod-stock"
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="15"
                  className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prod-image"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Image URL *
                </label>
                <input
                  id="prod-image"
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/products/keyboard.svg"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label
                  htmlFor="prod-preset"
                  className="block text-xs font-medium text-zinc-700 mb-1.5"
                >
                  Or Select Studio Asset Preset
                </label>
                <select
                  id="prod-preset"
                  value={
                    SAMPLE_IMAGE_PRESETS.some((p) => p.url === image)
                      ? image
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) setImage(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
                >
                  <option value="">Custom Image Path</option>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <option key={preset.url} value={preset.url}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="prod-desc"
                className="block text-xs font-medium text-zinc-700 mb-1.5"
              >
                Description *
              </label>
              <textarea
                id="prod-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide clear, factual product specifications and materials..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 rounded-lg transition-colors cursor-pointer"
              >
                {submitting
                  ? "Saving..."
                  : editingProduct
                  ? "Save Changes"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <h3 className="font-display text-lg font-semibold text-zinc-900">
              Confirm Product Deletion
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-zinc-900">{productToDelete.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold text-zinc-600">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs text-zinc-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs text-zinc-500"
                  >
                    No products in catalog. Click &ldquo;Add Product&rdquo; to
                    create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50/60">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-lg bg-[#F3F2EE] overflow-hidden shrink-0 border border-zinc-200/60">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            category={product.category}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-700">
                      {product.category}
                    </td>
                    <td className="py-4 px-6 font-mono tabular-nums font-medium text-zinc-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 font-mono tabular-nums text-xs">
                      <span
                        className={
                          product.stock > 0
                            ? "text-emerald-700 font-semibold"
                            : "text-red-700 font-semibold"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
