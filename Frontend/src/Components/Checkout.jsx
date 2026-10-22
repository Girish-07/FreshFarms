import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useCartStore, useCartSummary } from "../store/cartStore";
import { formatCurrency } from "../utils/market";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal, delivery, total } = useCartSummary();
  const navigate = useNavigate();
  const { user, token, setSession } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const loadedToken = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    instructions: "",
  });

  useEffect(() => {
    if (!token || loadedToken.current === token) return;
    loadedToken.current = token;
    api.getAddresses(token).then((addresses) => {
      setSession({ user: { ...user, addresses }, token });
    }).catch((requestError) => setError(requestError.message));
  }, [token, setSession, user]);

  const selectAddress = (event) => {
    const id = event.target.value;
    setSelectedAddressId(id);
    if (id === "new") {
      setForm({ name: user?.name || "", phone: user?.phone || "", address: "", city: "", state: "", pincode: "", instructions: "" });
      return;
    }
    const saved = user?.addresses?.find((address) => address.id === id);
    if (saved) setForm({ ...saved });
  };

  if (!items.length && !submitted) {
    return (
      <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <Link to="/products" className="mt-5 inline-block font-bold text-emerald-700">
          Browse products
        </Link>
      </main>
    );
  }

  const updateField = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    const requiredFields = ["name", "phone", "address", "city", "state", "pincode"];
    const missingField = requiredFields.find((field) => !form[field].trim());
    if (missingField) {
      setError("Please complete all delivery details before placing your order.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let savedAddresses = user.addresses || [];
      if (selectedAddressId === "new") {
        savedAddresses = await api.saveAddress(form, token);
        setSession({ user: { ...user, addresses: savedAddresses }, token });
      }
      const order = await api.createOrder({
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        deliveryAddress: form,
        paymentMethod: "cod",
      }, token);
      setSubmitted(true);
      clearCart();
      navigate(`/orders/${order.orderNumber}/success`, { state: { order } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-900 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/cart" className="font-bold text-emerald-700">← Back to cart</Link>
        <h1 className="mt-5 text-3xl font-black sm:text-5xl">Checkout</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submitOrder} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black">Delivery details</h2>
            {user?.addresses?.length > 0 && (
              <label className="mt-5 block text-sm font-bold text-slate-700">
                Choose a saved address
                <select value={selectedAddressId} onChange={selectAddress} className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-600">
                  <option value="new">Use a new address</option>
                  {user.addresses.map((address) => <option key={address.id} value={address.id}>{address.address}, {address.city} - {address.pincode}</option>)}
                </select>
              </label>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Full name", "text"],
                ["phone", "Mobile number", "tel"],
                ["city", "City", "text"],
                ["state", "State", "text"],
                ["pincode", "Pincode", "text"],
              ].map(([name, label, type]) => (
                <label key={name} className={name === "name" || name === "phone" ? "sm:col-span-1" : ""}>
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                  <input name={name} type={type} value={form[name]} onChange={updateField} className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none focus:border-emerald-600" />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Full address</span>
                <textarea name="address" value={form.address} onChange={updateField} rows="3" className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none focus:border-emerald-600" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Delivery instructions <span className="font-normal text-slate-400">(optional)</span></span>
                <input name="instructions" value={form.instructions} onChange={updateField} placeholder="Leave at the gate, call on arrival..." className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none focus:border-emerald-600" />
              </label>
            </div>
            <h2 className="mt-8 text-xl font-black">Payment method</h2>
            <div className="mt-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4">
              <p className="font-bold">Cash on Delivery</p>
              <p className="mt-1 text-sm text-slate-500">Pay when your fresh order arrives.</p>
            </div>
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={loading} type="submit" className="mt-8 w-full rounded-full bg-emerald-700 px-5 py-3.5 font-bold text-white hover:bg-emerald-800">
              {loading ? "Placing order..." : `${user ? "Place order" : "Sign in to order"} · ${formatCurrency(total)}`}
            </button>
          </form>
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">{item.name} × {item.quantity}</span>
                  <span className="font-bold">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{delivery ? formatCurrency(delivery) : "Free"}</span></div>
                <div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatCurrency(total)}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="mt-16"><Footer /></div>
    </main>
  );
};

export default Checkout;
