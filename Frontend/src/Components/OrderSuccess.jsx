import { Link, useLocation, useParams } from "react-router-dom";
import Footer from "./Footer";
import { formatCurrency } from "../utils/market";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuthStore } from "../store/authStore";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(state?.order || null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!order && token) {
      const loadOrder = async () => {
        try {
          setOrder(await api.getOrder(orderId, token));
        } catch (requestError) {
          setError(requestError.message);
        }
      };
      loadOrder();
    }
  }, [order, orderId, token]);
  const orderTotal = order?.total || 0;

  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-16 text-center text-slate-900">
      <div className="mx-auto max-w-xl rounded-3xl bg-white px-6 py-12 shadow-sm sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <p className="mt-6 font-semibold text-orange-600">Order placed successfully</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Thank you for shopping local!</h1>
        <p className="mt-4 leading-7 text-slate-500">Your fresh order is being prepared. We will call you before delivery.</p>
        <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-left text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Order ID</span><strong>{orderId}</strong></div>
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Payment</span><strong>Cash on Delivery</strong></div>
          {order && <div className="mt-3 flex justify-between"><span className="text-slate-500">Status</span><strong className="capitalize">{order.status.replaceAll("-", " ")}</strong></div>}
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Total</span><strong>{formatCurrency(orderTotal)}</strong></div>
          {order?.deliveryAddress && <p className="mt-3 border-t border-emerald-100 pt-3 text-slate-600">{order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>}
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>
        <Link to="/products" className="mt-8 inline-block rounded-full bg-emerald-700 px-6 py-3 font-bold text-white">Continue shopping</Link>
      </div>
      <div className="mx-auto mt-16 max-w-7xl"><Footer /></div>
    </main>
  );
};

export default OrderSuccess;
