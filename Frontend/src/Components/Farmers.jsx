import { Link } from "react-router-dom";
import Footer from "./Footer";
import { farmers } from "../data/marketData";
import { getFarmerId } from "../utils/market";

const Farmers = () => (
  <main className="min-h-screen bg-emerald-100 px-6 py-12 text-slate-900 lg:px-10 lg:py-16">
    <div className="mx-auto max-w-7xl">
      <p className="font-semibold text-orange-600">People behind your produce</p>
      <h1 className="mt-2 text-3xl font-black sm:text-5xl">Meet our farmers</h1>
      <p className="mt-4 max-w-2xl text-slate-500">Browse fresh products by the trusted local growers who supply them.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {farmers.map((farmer) => (
          <article key={farmer.name} className="slow-card-hover rounded-2xl border-2 border-transparent bg-white p-5 shadow-sm hover:border-emerald-500">
            <Link
              to={`/farmers/${getFarmerId(farmer)}`}
              aria-label={`Shop ${farmer.name}`}
              className="block"
            >
              <img src={farmer.image} alt={`${farmer.name} profile`} className="h-56 w-full cursor-pointer rounded-xl object-cover" />
            </Link>
            <h2 className="mt-5 text-xl font-black">{farmer.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{farmer.details}</p>
            <p className="mt-3 text-sm"><span className="font-bold">Specializes in:</span> {farmer.specialty}</p>
            <Link to={`/farmers/${getFarmerId(farmer)}`} className="mt-5 block rounded-full bg-emerald-700 px-3 py-2 text-center text-sm font-bold text-white">Shop this farmer</Link>
          </article>
        ))}
      </div>
    </div>
    <div className="mx-auto mt-16 max-w-7xl"><Footer /></div>
  </main>
);

export default Farmers;
