export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getProductId = (product) => product.id || slugify(product.name);

export const getFarmerId = (farmer) => farmer.id || slugify(farmer.name);

export const getProductById = (id, products) =>
  products.find((product) => getProductId(product) === id);

export const getFarmerById = (id, farmers) =>
  farmers.find((farmer) => getFarmerId(farmer) === id);

export const getPrice = (price) =>
  Number(String(price).split("/")[0].replace(/[^0-9.]/g, "")) || 0;

export const getUnit = (price) => {
  const unit = price.match(/\/.+$/)?.[0];
  return unit ? unit.slice(1) : "item";
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
