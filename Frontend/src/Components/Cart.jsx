import { Link } from "react-router-dom";
import Footer from "./Footer";
import { useCartStore, useCartSummary } from "../store/cartStore";
import { formatCurrency } from "../utils/market";

const Cart = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { subtotal, delivery, total, itemCount } = useCartSummary();

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-900 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-orange-600">Your fresh basket</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black sm:text-5xl">Shopping cart</h1>
            <p className="mt-2 text-slate-500">{itemCount} items ready to go</p>
          </div>
          <Link to="/products" className="font-bold text-emerald-700">
            Continue shopping →
          </Link>
        </div>

        {!items.length ? (
          <div className="mt-10 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-5xl">🧺</p>
            <h2 className="mt-5 text-2xl font-black">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">
              Add something fresh to get started.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 font-bold text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover sm:h-32 sm:w-32"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className="font-bold text-slate-950 sm:text-lg"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="h-fit text-xl text-slate-400 hover:text-red-600"
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-emerald-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1.5 font-bold text-emerald-700"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1.5 font-bold text-emerald-700"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-black">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span>{delivery ? formatCurrency(delivery) : "Free"}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-emerald-700 px-5 py-3 text-center font-bold text-white hover:bg-emerald-800"
              >
                Proceed to checkout
              </Link>
              <p className="mt-4 text-center text-xs text-slate-500">
                Free delivery on orders above ₹500
              </p>
            </aside>
          </div>
        )}
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
};

export default Cart;
