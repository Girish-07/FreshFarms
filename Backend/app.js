import "dotenv/config";

import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/database.js";
import { errorHandler, notFound } from "./middlewares/errors.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import productRoutes from "./routes/products.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", database: process.env.MONGODB_URI ? "configured" : "in-memory" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  const startServer = async () => {
    try {
      await connectDatabase();
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error) {
      console.error("Unable to start the server:", error.message);
      process.exitCode = 1;
    }
  };

  await startServer();
}

export default app;
