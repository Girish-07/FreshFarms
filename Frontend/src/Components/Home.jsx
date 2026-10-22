import { Link } from "react-router-dom";
import Footer from "./Footer";
import { categories } from "../data/marketData";
import ProductCard from "./ProductCard";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const loadedProducts = await api.getProducts();
        setProducts(loadedProducts);
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen  text-slate-900 bg-emerald-100">
      {error && <p className="bg-red-50 px-6 py-3 text-center text-sm font-semibold text-red-600">{error}</p>}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pt-14">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            🥕 Fresh Today · Delivered from farm
          </p>
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Buy Fresh,
            <br />Shop Fresh,{" "}
            <br />
            <span className="text-emerald-700">Save Money</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Get the freshest produce at fair prices while supporting your community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="cursor-pointer rounded-full bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"
            >
              Start Shopping
            </Link>
            <Link
              to="/profile"
              className="cursor-pointer rounded-full border border-emerald-700 px-6 py-3.5 font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Go to Profile
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 sm:gap-8">
            <div>
              <strong className="block text-2xl font-black">500+</strong>
              <span className="text-sm text-slate-500">Fresh Products</span>
            </div>
            <div>
              <strong className="block text-2xl font-black">10K+</strong>
              <span className="text-sm text-slate-500">Happy Customers</span>
            </div>
            <div>
              <strong className="block text-2xl font-black">50+</strong>
              <span className="text-sm text-slate-500">Product Types</span>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1573481078935-b9605167e06b?auto=format&fit=crop&w=1080&q=85"
          alt="Fresh vegetables at the market"
          className="min-h-[360px] rounded-[2rem] object-cover lg:min-h-[500px]"
        />
      </div>

      <div className="bg-emerald-50 px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-orange-600">
                Fresh choices for every kitchen
              </p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Shop by Category
              </h2>
              <p className="mt-2 text-slate-500">
                Discover fresh, locally sourced products for your kitchen
              </p>
            </div>
            <Link
              to="/products"
              className="hidden cursor-pointer text-sm font-bold text-emerald-700 sm:block"
            >
              View All Products →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="slow-card-hover cursor-pointer rounded-2xl border border-slate-100 bg-stone-50 p-5 text-left hover:border-emerald-200 hover:shadow-md"
              >
                <span className="text-4xl">{category.icon}</span>
                <h3 className="mt-4 text-sm font-bold sm:mt-5 sm:text-base">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-emerald-100 px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="font-semibold text-orange-600">Fresh from the farm</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-slate-500">
              Discover the freshest products at the best prices
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="cursor-pointer font-bold text-emerald-700"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
