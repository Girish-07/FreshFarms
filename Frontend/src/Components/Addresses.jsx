import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";

const emptyAddress = { name: "", phone: "", address: "", city: "", state: "", pincode: "", instructions: "" };

const Addresses = () => {
  const { user, token, setSession } = useAuthStore();
  const [form, setForm] = useState({ ...emptyAddress, name: user?.name || "", phone: user?.phone || "" });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const loadedToken = useRef(null);
  useEffect(() => {
    if (!token || loadedToken.current === token) return;
    loadedToken.current = token;
    api.getAddresses(token).then((saved) => {
      setAddresses(saved);
      setSession({ user: { ...user, addresses: saved }, token });
    }).catch((requestError) => setError(requestError.message));
  }, [token, setSession, user]);
  if (!user) return <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center"><h1 className="text-3xl font-black">Sign in to manage your addresses</h1><Link to="/login" className="mt-5 inline-block font-bold text-emerald-700">Sign in</Link></main>;
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const addresses = await api.saveAddress(form, token);
      setAddresses(addresses);
      setSession({ user: { ...user, addresses }, token });
      setForm({ ...emptyAddress, name: user.name, phone: user.phone || "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-950 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link to="/profile" className="font-bold text-emerald-700">← Back to profile</Link>
        <h1 className="mt-5 text-3xl font-black sm:text-5xl">Saved addresses</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Your addresses</h2>
            <div className="mt-5 space-y-3">
              {addresses.length ? addresses.map((address) => <article key={address.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="font-bold">{address.name} · {address.phone}</p><p className="mt-1 text-sm text-slate-600">{address.address}, {address.city}, {address.state} - {address.pincode}</p></article>) : <p className="text-slate-500">No saved addresses yet.</p>}
            </div>
          </section>
          <form onSubmit={save} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Add an address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["name", "phone", "city", "state", "pincode"].map((field) => <label key={field} className="text-sm font-bold capitalize">{field}<input required name={field} value={form[field]} onChange={updateField} className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 font-normal outline-none focus:border-emerald-600" /></label>)}
              <label className="sm:col-span-2 text-sm font-bold">Full address<textarea required name="address" value={form.address} onChange={updateField} rows="3" className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 font-normal outline-none focus:border-emerald-600" /></label>
              <label className="sm:col-span-2 text-sm font-bold">Instructions <input name="instructions" value={form.instructions} onChange={updateField} className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 font-normal outline-none focus:border-emerald-600" /></label>
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={saving} className="mt-6 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">{saving ? "Saving..." : "Save address"}</button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl"><Footer /></div>
    </main>
  );
};

export default Addresses;
