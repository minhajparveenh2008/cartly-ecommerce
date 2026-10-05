import Product from "../models/Product.js";

const VALID_CATEGORIES = ["Electronics", "Accessories", "Home", "Lifestyle"];

// @desc    Get all products (with optional search/filter query params)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, availability } = req.query;
    let products = await Product.findAll();

    if (search && String(search).trim() !== "") {
      const q = String(search).toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      products = products.filter(
        (p) => p.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        products = products.filter((p) => p.price >= min);
      }
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        products = products.filter((p) => p.price <= max);
      }
    }

    if (availability === "in-stock") {
      products = products.filter((p) => p.stock > 0);
    } else if (availability === "out-of-stock") {
      products = products.filter((p) => p.stock === 0);
    }

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required product fields." });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number." });
    }

    if (
      Number.isNaN(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative whole number." });
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      category,
      image,
      stock: numericStock,
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found." });
    }

    const { name, description, price, category, image, stock } = req.body;

    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    if (price !== undefined && (Number.isNaN(Number(price)) || Number(price) <= 0)) {
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number." });
    }

    if (
      stock !== undefined &&
      (Number.isNaN(Number(stock)) ||
        Number(stock) < 0 ||
        !Number.isInteger(Number(stock)))
    ) {
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative whole number." });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, {
      name: name ?? existing.name,
      description: description ?? existing.description,
      price: price !== undefined ? Number(price) : existing.price,
      category: category ?? existing.category,
      image: image ?? existing.image,
      stock: stock !== undefined ? Number(stock) : existing.stock,
    });

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res
      .status(200)
      .json({ message: "Product deleted successfully.", _id: deleted._id });
  } catch (error) {
    return next(error);
  }
};
