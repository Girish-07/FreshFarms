import User from "../models/User.js";
import { createId, hashPassword, verifyPassword } from "./auth.js";

const users = [];
const useDatabase = () => Boolean(process.env.MONGODB_URI);
const publicUser = (user) => ({
  id: user.id || user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  profilePicture: user.profilePicture || "",
  addresses: user.addresses || [],
});

const addressFields = ["name", "phone", "address", "city", "state", "pincode"];
const normalizeAddress = (address) => ({
  name: address.name.trim(),
  phone: address.phone.trim(),
  address: address.address.trim(),
  city: address.city.trim(),
  state: address.state.trim(),
  pincode: address.pincode.trim(),
  instructions: typeof address.instructions === "string" ? address.instructions.trim() : "",
});
const sameAddress = (first, second) =>
  addressFields.every((field) => first[field].toLowerCase() === second[field].toLowerCase());

export const createUser = async ({ name, email, password, phone = "", profilePicture = "" }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = useDatabase()
    ? await User.findOne({ email: normalizedEmail })
    : users.find((user) => user.email === normalizedEmail);
  if (existing) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = {
    id: createId(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    phone: phone.trim(),
    profilePicture: profilePicture.trim(),
    addresses: [],
  };
  const saved = useDatabase() ? await User.create(user) : (users.push(user), user);
  return publicUser(saved);
};

export const updateUser = async (id, { name, email, password, phone = "", profilePicture = "" }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = useDatabase()
    ? await User.findOne({ email: normalizedEmail, id: { $ne: id } })
    : users.find((user) => user.email === normalizedEmail && user.id !== id);
  if (existing) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const updates = {
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    profilePicture: profilePicture.trim(),
  };
  if (password) updates.passwordHash = await hashPassword(password);

  if (useDatabase()) {
    const updated = await User.findOneAndUpdate({ id }, updates, { new: true, runValidators: true }).lean();
    return updated ? publicUser(updated) : null;
  }

  const user = users.find((candidate) => candidate.id === id);
  if (!user) return null;
  Object.assign(user, updates);
  return publicUser(user);
};

export const authenticateUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = useDatabase()
    ? await User.findOne({ email: normalizedEmail })
    : users.find((candidate) => candidate.email === normalizedEmail);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return publicUser(user);
};

export const findUser = async (id) => {
  const user = useDatabase() ? await User.findOne({ id }).lean() : users.find((candidate) => candidate.id === id);
  return user ? publicUser(user) : null;
};

export const addAddress = async (id, address) => {
  const normalized = normalizeAddress(address);
  if (useDatabase()) {
    const user = await User.findOne({ id });
    if (!user) return null;
    if (!user.addresses) user.addresses = [];
    const existing = (user.addresses || []).find((saved) => sameAddress(saved, normalized));
    if (existing) return publicUser(user);
    user.addresses.push({ id: createId(), ...normalized });
    await user.save();
    return publicUser(user);
  }

  const user = users.find((candidate) => candidate.id === id);
  if (!user) return null;
  if (!user.addresses) user.addresses = [];
  if (!user.addresses.some((saved) => sameAddress(saved, normalized))) {
    user.addresses.push({ id: createId(), ...normalized });
  }
  return publicUser(user);
};

export const listAddresses = async (id) => {
  const user = useDatabase() ? await User.findOne({ id }).lean() : users.find((candidate) => candidate.id === id);
  return user ? user.addresses || [] : null;
};
