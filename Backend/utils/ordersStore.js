import Order from "../models/Order.js";
import { createId } from "./auth.js";
import { findProduct } from "./catalogStore.js";

const orders = [];
const useDatabase = () => Boolean(process.env.MONGODB_URI);

const orderNumber = () => `FF-${Date.now().toString(36).toUpperCase()}-${createId().slice(0, 4).toUpperCase()}`;
const calculateDelivery = (subtotal) => (subtotal > 0 && subtotal < 500 ? 40 : 0);
const addMissingImages = async (order) => {
  if (!order) return order;
  const items = [];
  for (const item of order.items) {
    const product = item.image ? null : await findProduct(item.productId);
    items.push({ ...item, image: item.image || product?.image || "" });
  }
  return { ...order, items };
};

export const createOrder = async (userId, payload) => {
  const { items, deliveryAddress, paymentMethod = "cod" } = payload || {};
  if (!Array.isArray(items) || items.length === 0) throw Object.assign(new Error("At least one product is required"), { statusCode: 400 });
  if (paymentMethod !== "cod") throw Object.assign(new Error("Only Cash on Delivery is currently supported"), { statusCode: 400 });
  const requiredAddress = ["name", "phone", "address", "city", "state", "pincode"];
  if (!deliveryAddress || requiredAddress.some((field) => typeof deliveryAddress[field] !== "string" || !deliveryAddress[field].trim())) {
    throw Object.assign(new Error("Complete delivery details are required"), { statusCode: 400 });
  }

  const orderItems = [];
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw Object.assign(new Error("Each quantity must be a whole number between 1 and 99"), { statusCode: 400 });
    }
    const product = await findProduct(item.productId);
    if (!product) throw Object.assign(new Error(`Product ${item.productId} was not found`), { statusCode: 400 });
    orderItems.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      unit: product.unit,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const order = {
    orderNumber: orderNumber(),
    userId,
    items: orderItems,
    deliveryAddress: { ...deliveryAddress, instructions: deliveryAddress.instructions || "" },
    subtotal,
    delivery: calculateDelivery(subtotal),
    total: subtotal + calculateDelivery(subtotal),
    paymentMethod,
    status: "placed",
  };
  return useDatabase() ? Order.create(order) : (orders.push(order), order);
};

export const listOrders = async (userId) => {
  const foundOrders = useDatabase()
    ? await Order.find({ userId }).sort({ createdAt: -1 }).lean()
    : orders.filter((order) => order.userId === userId).reverse();
  const hydratedOrders = [];
  for (const order of foundOrders) hydratedOrders.push(await addMissingImages(order));
  return hydratedOrders;
};

export const findOrder = async (userId, orderNumberValue) => {
  const order = useDatabase()
    ? Order.findOne({ userId, orderNumber: orderNumberValue }).lean()
    : orders.find((order) => order.userId === userId && order.orderNumber === orderNumberValue);
  return addMissingImages(await order);
};
