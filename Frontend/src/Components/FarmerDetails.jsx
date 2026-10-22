import { Link, useParams } from "react-router-dom";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { farmers } from "../data/marketData";
import { getFarmerById } from "../utils/market";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const farmer = getFarmerById(farmerId, farmers);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!farmer) return;
    api.getProductsByFarmer(farmerId).then(setFarmerProducts).catch((requestError) => setError(requestError.message));
  }, [farmer, farmerId]);
  if (!farmer) {
    return <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center"><h1 className="text-3xl font-black">Farmer not found</h1><Link to="/farmers" className="mt-5 inline-block font-bold text-emerald-700">Back to farmers</Link></main>;
  }
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-900 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/farmers" className="font-bold text-emerald-700">← Back to farmers</Link>
        <section className="mt-8 grid gap-7 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[220px_1fr] md:p-8">
          <img src={farmer.image} alt={farmer.name} className="h-56 w-full rounded-2xl object-cover" />
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-orange-600">Fresh products from</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">{farmer.name}</h1>
            <p className="mt-2 text-slate-500">{farmer.details}</p>
            <p className="mt-5 leading-7 text-slate-600">Shop this farmer's fresh, fairly priced produce.</p>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-black">Products from {farmer.name}</h2>
          {error ? <p className="mt-5 text-sm font-semibold text-red-600">{error}</p> : farmerProducts.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{farmerProducts.map((product) => <ProductCard key={product.name} product={product} />)}</div> : <p className="mt-5 text-slate-500">Loading products...</p>}
        </section>
      </div>
      <div className="mt-16"><Footer /></div>
    </main>
  );
};

export default FarmerDetails;
