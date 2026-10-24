// Set VITE_API_URL to point the frontend at a different backend.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Keep product prices in the display format expected by the components.
const formatProduct = (product) => ({
  ...product,
  price: `₹${product.price}/${product.unit}`,
  oldPrice: product.oldPrice === undefined ? "" : `₹${product.oldPrice}`,
});

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  let body;
  try {
    body = await response.json();
  } catch {
    // Non-JSON responses still need to report HTTP errors clearly below.
    body = {};
  }
  if (!response.ok) throw new Error(body.error || "Something went wrong");
  // The backend wraps successful response data in a `data` property.
  return body.data;
};

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const api = {
  // Products
  getProducts: async (query = "") => {
    const products = await apiRequest(
      `/products${query ? `?${query}` : ""}`,
    );
    return products.map(formatProduct);
  },
  getProductsByFarmer: async (farmerId) => {
    const products = await apiRequest(
      `/products?farmerId=${encodeURIComponent(farmerId)}`,
    );
    return products.map(formatProduct);
  },
  getProduct: async (id) => {
    const product = await apiRequest(`/products/${encodeURIComponent(id)}`);
    return formatProduct(product);
  },

  // Account and profile
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProfile: (payload, token) =>
    apiRequest("/auth/me", {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),

  // Saved addresses
  saveAddress: (payload, token) =>
    apiRequest("/auth/addresses", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),
  getAddresses: (token) =>
    apiRequest("/auth/addresses", { headers: authHeaders(token) }),

  // Orders
  createOrder: (payload, token) =>
    apiRequest("/orders", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),
  getOrders: (token) => apiRequest("/orders", { headers: authHeaders(token) }),
  getOrder: (orderNumber, token) =>
    apiRequest(`/orders/${encodeURIComponent(orderNumber)}`, {
      headers: authHeaders(token),
    }),
};
