import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api.login({ email, password });
      setSession(session);
      navigate(location.state?.from || "/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-12 text-slate-900 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-emerald-100 shadow-xl shadow-emerald-900/10 lg:grid-cols-2">
        <section className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-emerald-700 p-8 text-white sm:p-12">
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tight">
              Fresh<span className="text-orange-300">Farm</span>
            </Link>
            <p className="mt-16 max-w-sm text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
              workspace
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Grow the marketplace with confidence.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-emerald-100">
              Shop fresh produce and follow your orders.
            </p>
          </div>
          <div className="relative z-10 mt-10 flex gap-3 text-sm text-emerald-100">
            <span className="rounded-full bg-emerald-600 px-4 py-2">
              500+ fresh products
            </span>
            <span className="rounded-full bg-emerald-600 px-4 py-2">
              Fresh every day
            </span>
          </div>
          <span className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[28px] border-emerald-600/70" />
          <span className="absolute -right-8 top-20 h-24 w-24 rounded-full bg-orange-400/80" />
        </section>

        <section className="bg-emerald-50 p-8 sm:p-12">
          <div className="mx-auto max-w-md">
            <p className="font-semibold text-orange-600">Welcome back</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Hello,
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in, to open your FreshFarm account.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-bold text-slate-700">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3.5 font-normal text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3.5 font-normal text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-700"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/20 transition-colors hover:bg-emerald-800"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            </form>

            <div className="my-8 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              <span className="h-px flex-1 bg-emerald-200" />
              or
              <span className="h-px flex-1 bg-emerald-200" />
            </div>
            <div>
              <Link
                to="/register"
                className="block w-full rounded-xl border border-emerald-300 bg-white px-4 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-100"
              >
                Create account
              </Link>
            </div>
            <Link
              to="/"
              className="mt-8 block text-center text-sm font-bold text-slate-500 hover:text-emerald-700"
            >
              ← Back to FreshFarm
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
