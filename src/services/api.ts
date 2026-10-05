export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  token?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "Electronics" | "Accessories" | "Home" | "Lifestyle";
  image: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id: string;
  user: string;
  userDetails?: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const rawApiUrl = import.meta.env.VITE_API_URL || "/api";
const API_BASE = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

const getToken = (): string | null => {
  try {
    return localStorage.getItem("cartly_token");
  } catch {
    return null;
  }
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (payload: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) =>
      request<User & { token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    login: (payload: { email: string; password: string }) =>
      request<User & { token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getMe: () => request<User>("/auth/me"),
  },

  products: {
    getAll: (params?: {
      search?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
      availability?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.category && params.category !== "All")
        searchParams.set("category", params.category);
      if (params?.minPrice) searchParams.set("minPrice", params.minPrice);
      if (params?.maxPrice) searchParams.set("maxPrice", params.maxPrice);
      if (params?.availability && params.availability !== "all")
        searchParams.set("availability", params.availability);

      const qs = searchParams.toString();
      return request<Product[]>(`/products${qs ? `?${qs}` : ""}`);
    },

    getById: (id: string) => request<Product>(`/products/${id}`),

    create: (payload: Omit<Product, "_id" | "createdAt" | "updatedAt">) =>
      request<Product>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (
      id: string,
      payload: Partial<Omit<Product, "_id" | "createdAt" | "updatedAt">>
    ) =>
      request<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),

    delete: (id: string) =>
      request<{ message: string; _id: string }>(`/products/${id}`, {
        method: "DELETE",
      }),
  },

  orders: {
    create: (payload: {
      items: OrderItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
    }) =>
      request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getMyOrders: () => request<Order[]>("/orders/my"),

    getById: (id: string) => request<Order>(`/orders/${id}`),

    getAll: () => request<Order[]>("/orders"),

    updateStatus: (id: string, status: OrderStatus) =>
      request<Order>(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },
};

export default api;
