const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    body = {};
  }
  if (!response.ok) throw new Error(body.error || "Something went wrong");
  return body.data;
};

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const api = {
  getProducts: async (query = "") => (await apiRequest(`/products${query ? `?${query}` : ""}`)).map(formatProduct),
  getProductsByFarmer: async (farmerId) => (await apiRequest(`/products?farmerId=${encodeURIComponent(farmerId)}`)).map(formatProduct),
  getProduct: async (id) => formatProduct(await apiRequest(`/products/${encodeURIComponent(id)}`)),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  updateProfile: (payload, token) => apiRequest("/auth/me", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  }),
  saveAddress: (payload, token) => apiRequest("/auth/addresses", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  }),
  getAddresses: (token) => apiRequest("/auth/addresses", { headers: authHeaders(token) }),
  createOrder: (payload, token) => apiRequest("/orders", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  }),
  getOrders: (token) => apiRequest("/orders", { headers: authHeaders(token) }),
  getOrder: (orderNumber, token) => apiRequest(`/orders/${encodeURIComponent(orderNumber)}`, { headers: authHeaders(token) }),
};
