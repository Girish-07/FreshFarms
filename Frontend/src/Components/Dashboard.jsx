import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/market";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const statusLabel = (status) => status.replaceAll("-", " ");

const OrderDetails = ({ order, onBack }) => (
  <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
    <button type="button" onClick={onBack} className="font-bold text-emerald-700 hover:text-emerald-900">
      ← Back to all orders
    </button>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Order details</p>
        <h2 className="mt-1 text-2xl font-black">{order.orderNumber}</h2>
        <p className="mt-2 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
      </div>
      <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold capitalize text-emerald-800">
        {statusLabel(order.status)}
      </span>
    </div>
    <div className="mt-6 space-y-4">
      {order.items.map((item) => (
        <div key={item.productId} className="flex gap-4 rounded-2xl border border-emerald-100 p-3 sm:p-4">
          <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24" />
          <div className="min-w-0 flex-1">
            <h3 className="font-black">{item.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.quantity} × {formatCurrency(item.unitPrice)} / {item.unit}
            </p>
          </div>
          <strong className="self-center text-right">{formatCurrency(item.lineTotal)}</strong>
        </div>
      ))}
    </div>
    <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
      <div><p className="text-slate-500">Subtotal</p><strong>{formatCurrency(order.subtotal)}</strong></div>
      <div><p className="text-slate-500">Delivery</p><strong>{order.delivery ? formatCurrency(order.delivery) : "Free"}</strong></div>
      <div><p className="text-slate-500">Total paid on delivery</p><strong className="text-lg">{formatCurrency(order.total)}</strong></div>
    </div>
    <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
      <p className="font-black">Delivery address</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {order.deliveryAddress.name}, {order.deliveryAddress.phone}<br />
        {order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
      </p>
      {order.deliveryAddress.instructions && <p className="mt-2 text-sm text-slate-500">Note: {order.deliveryAddress.instructions}</p>}
    </div>
  </section>
);

const Dashboard = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }
    const loadOrders = async () => {
      try {
        const loadedOrders = await api.getOrders(token);
        setOrders(loadedOrders);
        if (orderNumber) {
          setSelectedOrder(loadedOrders.find((order) => order.orderNumber === orderNumber) || null);
        } else {
          setSelectedOrder(null);
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [orderNumber, token]);

  const orderStats = {
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.total, 0),
    items: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
  };

  if (!user) {
    return <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center"><h1 className="text-3xl font-black">Sign in to view your dashboard</h1><Link to="/login" className="mt-5 inline-block font-bold text-emerald-700">Sign in</Link></main>;
  }

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-950 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-semibold text-orange-600">FreshFarm order centre</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-3xl font-black sm:text-5xl">Your dashboard</h1><p className="mt-3 text-slate-500">Track every order from checkout to delivery.</p></div>
          <Link to="/products" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Continue shopping</Link>
        </div>
        {!orderNumber && <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["Orders placed", orderStats.count], ["Items ordered", orderStats.items], ["Total order value", formatCurrency(orderStats.total)]].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>
          ))}
        </div>}
        {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</p>}
        {loading && <p className="mt-8 text-slate-500">Loading your orders...</p>}
        {!loading && !error && orderNumber && !selectedOrder && <section className="mt-8 rounded-3xl bg-white p-8 text-center"><p className="font-semibold text-red-600">Order not found</p><button type="button" onClick={() => navigate("/dashboard")} className="mt-4 font-bold text-emerald-700">Back to dashboard</button></section>}
        {!loading && !orderNumber && !orders.length && <section className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm"><p className="text-lg font-bold">You have not placed an order yet.</p><Link to="/products" className="mt-5 inline-block rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">Browse fresh products</Link></section>}
        {!loading && !orderNumber && orders.length > 0 && <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black">All orders</h2>
          <div className="mt-5 space-y-3">{orders.map((order) => (
            <Link key={order.orderNumber} to={`/dashboard/orders/${order.orderNumber}`} className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-100 p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
              <div className="flex -space-x-3">{order.items.slice(0, 3).map((item) => <img key={item.productId} src={item.image} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />)}</div>
              <div className="min-w-0 flex-1"><p className="font-black">{order.orderNumber}</p><p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)} · {order.items.length} product{order.items.length === 1 ? "" : "s"}</p></div>
              <div className="text-right"><p className="font-black">{formatCurrency(order.total)}</p><p className="mt-1 text-sm capitalize text-emerald-700">{statusLabel(order.status)}</p></div>
            </Link>
          ))}</div>
        </section>}
        {!loading && selectedOrder && <OrderDetails order={selectedOrder} onBack={() => navigate("/dashboard")} />}
      </div>
      <div className="mx-auto mt-16 max-w-7xl"><Footer /></div>
    </main>
  );
};

export default Dashboard;
