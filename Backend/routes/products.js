import { Router } from "express";
import { findProduct, listProducts } from "../utils/catalogStore.js";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    const { category, farmerId, search } = request.query;
    response.json({ data: await listProducts({ category, farmerId, search }) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const product = await findProduct(request.params.id);
    if (!product) return response.status(404).json({ error: "Product not found" });
    response.json({ data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
