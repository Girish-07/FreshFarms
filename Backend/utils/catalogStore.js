import seededProducts from "../data/catalog.js";
import Product from "../models/Product.js";

const useDatabase = () => Boolean(process.env.MONGODB_URI);
const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

export const listProducts = async ({ category, farmerId, search }) => {
  if (useDatabase()) {
    const query = {};
    if (category) query.category = category;
    if (farmerId) query.farmerId = farmerId;
    if (search) query.$or = [{ name: new RegExp(search, "i") }, { desc: new RegExp(search, "i") }];
    return Product.find(query).sort({ name: 1 }).lean();
  }

  return copy(
    seededProducts.filter((product) =>
      (!category || product.category.toLowerCase() === category.toLowerCase()) &&
      (!farmerId || product.farmerId === farmerId) &&
      (!search || `${product.name} ${product.desc}`.toLowerCase().includes(search.toLowerCase())),
    ),
  );
};

export const findProduct = async (id) =>
  useDatabase() ? Product.findOne({ id }).lean() : copy(seededProducts.find((product) => product.id === id));
