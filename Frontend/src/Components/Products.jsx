import { useEffect, useState } from "react";
import Footer from "./Footer";
import { categories } from "../data/marketData";
import { api } from "../utils/api";
import ProductCard from "./ProductCard";

const Products = () => {
  const productsPerLoad = 15;
  const [activeCategory, setActiveCategory] = useState(
    () => new URLSearchParams(window.location.search).get("category") || "All products",
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(productsPerLoad);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProducts(await api.getProducts());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesCategory =
      activeCategory === "All products" || product.category === activeCategory;
    const matchesSearch =
      !query ||
      `${product.name} ${product.desc} ${product.farmer}`
        .toLowerCase()
        .includes(query);
    return matchesCategory && matchesSearch;
  });

  if (sort !== "featured") {
    filteredProducts.sort((first, second) => {
      const firstPrice = Number(first.price.replace(/[^0-9]/g, ""));
      const secondPrice = Number(second.price.replace(/[^0-9]/g, ""));
      return sort === "price-low"
        ? firstPrice - secondPrice
        : secondPrice - firstPrice;
    });
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-emerald-100 text-slate-900">
      <section className="bg-emerald-100 px-4 pb-2 pt-3 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-orange-600">Fresh for your kitchen</p>
          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="hidden text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:block lg:text-5xl">
                Fresh products, fair prices
              </h1>
              <p className="mt-4 hidden max-w-2xl text-lg leading-8 text-slate-600 lg:block">
                Discover the freshest products at the best prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-3 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-4 shadow-sm lg:flex-row lg:items-center">
          <label className="relative flex flex-1 items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-slate-400">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search products</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(productsPerLoad);
              }}
              placeholder="Search tomatoes, mangoes, milk..."
              className="w-full bg-transparent pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                title="Clear search"
                onClick={() => {
                  setSearch("");
                  setVisibleCount(productsPerLoad);
                }}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold text-slate-500 hover:bg-emerald-200 hover:text-emerald-800"
              >
                ×
              </button>
            )}
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-600">
            Sort by
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setVisibleCount(productsPerLoad);
              }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-emerald-600"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {[{ name: "All products", icon: "✦" }, ...categories].map(
            (category) => (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setVisibleCount(productsPerLoad);
                }}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeCategory === category.name ? "bg-emerald-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"}`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ),
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
            All products
          </h2>
          {/* <p className="text-sm text-slate-500">
            {visibleProducts.length} results
          </p> */}
        </div>

        {loading ? <p className="mt-8 text-slate-500">Loading fresh products...</p> : error ? <p className="mt-8 text-sm font-semibold text-red-600">{error}</p> : visibleProducts.length ? (
          <div
            key={`${activeCategory}-${search}-${sort}`}
            className="catalog-results mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          >
            {visibleProducts.map((product) => (
              <div key={product.name} className="catalog-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="catalog-results mt-6 rounded-2xl bg-emerald-100 px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-900">
              No products found
            </p>
            <p className="mt-2 text-slate-500">
              Try another search or category.
            </p>
          </div>
        )}
        {visibleProducts.length > 0 && visibleProducts.length < filteredProducts.length ? (
          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              onClick={() => setVisibleCount((count) => count + productsPerLoad)}
              className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-bold text-white sm:px-6 sm:py-3 sm:text-sm"
            >
              View More Products
            </button>
          </div>
        ) : null}
      </section>
      <Footer />
    </main>
  );
};

export default Products;
