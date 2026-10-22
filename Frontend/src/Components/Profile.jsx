import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/market";

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, setSession, signOut } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", profilePicture: "" });

  useEffect(() => {
    if (!token || !user) return;
    const loadSummary = async () => {
      try {
        setOrders(await api.getOrders(token));
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    loadSummary();
  }, [token, user]);

  const summary = {
    total: orders.reduce((sum, order) => sum + order.total, 0),
    items: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    lastOrder: orders[0],
  };

  if (!user) {
    return <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center"><h1 className="text-3xl font-black">Sign in to view your profile</h1><Link to="/login" className="mt-5 inline-block font-bold text-emerald-700">Sign in</Link></main>;
  }

  const startEditing = () => {
    setForm({ name: user.name, email: user.email, password: "", phone: user.phone || "", profilePicture: user.profilePicture || "" });
    setEditing(true);
  };
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updatedUser = await api.updateProfile(form, token);
      setSession({ user: updatedUser, token });
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };
  const confirmLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-950 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="font-semibold text-orange-600">Your FreshFarm account</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Your profile</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <section className="rounded-3xl bg-emerald-700 p-7 text-white shadow-sm sm:p-9">
            {user.profilePicture ? <img src={user.profilePicture} alt={`${user.name} profile`} className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-500" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-300 text-3xl font-black text-emerald-900">{user.name.charAt(0).toUpperCase()}</div>}
            <h2 className="mt-6 text-3xl font-black">{user.name}</h2>
            <p className="mt-2 text-emerald-100">{user.email}</p>
            {user.phone && <p className="mt-1 text-emerald-100">{user.phone}</p>}
            <p className="mt-8 text-sm leading-6 text-emerald-100">Thank you for shopping with us. Your fresh orders are delivered directly to your home.</p>
          </section>
          <section className="rounded-3xl bg-white p-7 shadow-sm sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">Your activity</h2><Link to="/dashboard" className="font-bold text-emerald-700">Open dashboard →</Link></div>
            <div className="mt-5 flex flex-wrap gap-3 border-b border-slate-100 pb-6">
              <button type="button" onClick={() => editing ? setEditing(false) : startEditing()} className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">{editing ? "Close editor" : "Edit profile"}</button>
              <button type="button" onClick={() => setConfirmSignOut(true)} className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">Sign out</button>
            </div>
            {editing && <form onSubmit={saveProfile} className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black">Edit your information</h3>
              {[["name", "Full name", "text"], ["email", "Email address", "email"], ["phone", "Phone number", "tel"], ["profilePicture", "Profile picture URL", "url"]].map(([name, label, type]) => (
                <label key={name} className="block text-sm font-bold text-slate-700">{label}<input name={name} type={type} value={form[name]} onChange={updateField} placeholder={name === "profilePicture" ? "https://..." : ""} required={name !== "password"} className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-600" /></label>
              ))}
              <button disabled={saving} type="submit" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white">{saving ? "Saving..." : "Save changes"}</button>
            </form>}
            {error && <p className="mt-5 text-sm font-semibold text-red-600">{error}</p>}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-slate-500">Orders</p><p className="mt-2 text-2xl font-black">{orders.length}</p></div>
              <div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm text-slate-500">Items bought</p><p className="mt-2 text-2xl font-black">{summary.items}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Total spent</p><p className="mt-2 text-2xl font-black">{formatCurrency(summary.total)}</p></div>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Latest order</p>
              {summary.lastOrder ? <div className="mt-3 flex items-center justify-between gap-4"><div><p className="font-black">{summary.lastOrder.orderNumber}</p><p className="mt-1 text-sm capitalize text-slate-500">{summary.lastOrder.status.replaceAll("-", " ")}</p></div><Link to={`/dashboard/orders/${summary.lastOrder.orderNumber}`} className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700">View order</Link></div> : <p className="mt-3 text-slate-500">Your first order will appear here.</p>}
            </div>
          </section>
        </div>
        <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm sm:p-9">
          <h2 className="text-2xl font-black">Quick links</h2>
          <div className="mt-5 flex flex-wrap gap-3"><Link to="/products" className="rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">Shop products</Link><Link to="/addresses" className="rounded-full border border-emerald-300 px-5 py-3 font-bold text-emerald-700">Manage addresses</Link><Link to="/dashboard" className="rounded-full border border-emerald-300 px-5 py-3 font-bold text-emerald-700">View all orders</Link></div>
        </section>
      </div>
      <div className="mx-auto mt-16 max-w-7xl"><Footer /></div>
      {confirmSignOut && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" role="dialog" aria-modal="true" aria-labelledby="signout-title">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
          <h2 id="signout-title" className="text-2xl font-black">Sign out of FreshFarm?</h2>
          <p className="mt-3 leading-6 text-slate-500">You can sign back in anytime to view your profile and orders.</p>
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmSignOut(false)} className="rounded-full border border-slate-200 px-5 py-3 font-bold text-slate-600">Cancel</button><button type="button" onClick={confirmLogout} className="rounded-full bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">Yes, sign out</button></div>
        </div>
      </div>}
    </main>
  );
};

export default Profile;
