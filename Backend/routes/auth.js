import { Router } from "express";
import {
  addAddress,
  authenticateUser,
  createUser,
  findUser,
  listAddresses,
  updateUser,
} from "../utils/usersStore.js";

const router = Router();
const validEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validAddress = (address) =>
  address &&
  ["name", "phone", "address", "city", "state", "pincode"].every(
    (field) => typeof address[field] === "string" && address[field].trim(),
  );
const userIdFromRequest = (request) =>
  (request.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();

router.post("/register", async (request, response, next) => {
  try {
    const {
      name,
      email,
      password,
      phone = "",
      profilePicture = "",
    } = request.body || {};
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      !validEmail(email) ||
      typeof password !== "string" ||
      password.length < 6 ||
      typeof phone !== "string" ||
      typeof profilePicture !== "string"
    ) {
      return response
        .status(400)
        .json({
          error:
            "Name, valid email, phone, profile picture, and a password of at least 6 characters are required",
        });
    }
    const user = await createUser({
      name,
      email,
      password,
      phone,
      profilePicture,
    });
    response
      .status(201)
      .json({ data: { user, token: user.id } });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body || {};
    if (!validEmail(email) || typeof password !== "string")
      return response
        .status(400)
        .json({ error: "Email and password are required" });
    const user = await authenticateUser(email, password);
    if (!user)
      return response.status(401).json({ error: "Invalid email or password" });
    response.json({ data: { user, token: user.id } });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (request, response, next) => {
  try {
    const user = await findUser(userIdFromRequest(request));
    if (!user)
      return response.status(404).json({ error: "Account no longer exists" });
    response.json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.patch("/me", async (request, response, next) => {
  try {
    const {
      name,
      email,
      password = "",
      phone = "",
      profilePicture = "",
    } = request.body || {};
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      !validEmail(email) ||
      (password && password.length < 6) ||
      typeof phone !== "string" ||
      typeof profilePicture !== "string"
    ) {
      return response
        .status(400)
        .json({
          error:
            "Name, valid email, phone, profile picture, and an optional password of at least 6 characters are required",
        });
    }
    const user = await updateUser(userIdFromRequest(request), {
      name,
      email,
      password,
      phone,
      profilePicture,
    });
    if (!user)
      return response.status(404).json({ error: "Account no longer exists" });
    response.json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.post("/addresses", async (request, response, next) => {
  try {
    if (!validAddress(request.body))
      return response
        .status(400)
        .json({ error: "Complete address details are required" });
    const user = await addAddress(userIdFromRequest(request), request.body);
    if (!user)
      return response.status(404).json({ error: "Account no longer exists" });
    response.status(201).json({ data: user.addresses });
  } catch (error) {
    next(error);
  }
});

router.get("/addresses", async (request, response, next) => {
  try {
    const addresses = await listAddresses(userIdFromRequest(request));
    if (!addresses)
      return response.status(404).json({ error: "Account no longer exists" });
    response.json({ data: addresses });
  } catch (error) {
    next(error);
  }
});

export default router;
