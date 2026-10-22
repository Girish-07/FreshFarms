import { Router } from "express";
import { createOrder, findOrder, listOrders } from "../utils/ordersStore.js";

const router = Router();
const userIdFromRequest = (request) =>
  (request.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();

router.post("/", async (request, response, next) => {
  try {
    response.status(201).json({ data: await createOrder(userIdFromRequest(request), request.body) });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (request, response, next) => {
  try {
    response.json({ data: await listOrders(userIdFromRequest(request)) });
  } catch (error) {
    next(error);
  }
});

router.get("/:orderNumber", async (request, response, next) => {
  try {
    const order = await findOrder(userIdFromRequest(request), request.params.orderNumber);
    if (!order) return response.status(404).json({ error: "Order not found" });
    response.json({ data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
