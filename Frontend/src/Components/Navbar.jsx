import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useCartSummary } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

const tabs = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Farmers", path: "/farmers" },
  { label: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCartSummary();
  const { user } = useAuthStore();

  return (
    <nav className="relative mx-auto flex max-w-full items-center justify-between bg-emerald-200 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-10 lg:py-5">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-emerald-800 hover:bg-emerald-300 lg:hidden"
      >
        ☰
      </button>
      <NavLink
        to="/"
        className="absolute left-1/2 -translate-x-1/2 text-xl font-black tracking-tight text-emerald-800 sm:text-2xl lg:static lg:translate-x-0"
      >
        &nbsp;&nbsp; Fresh<span className="text-orange-500">Farm</span>
      </NavLink>
      <div className="ml-auto hidden items-center gap-1 text-sm font-medium text-slate-600 lg:ml-auto lg:mr-4 lg:flex lg:gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              isActive
                ? "shrink-0 rounded-full bg-white px-4 py-2 text-emerald-700 transition-all duration-300 hover:bg-gray-200 lg:px-10 lg:py-3"
                : "shrink-0 rounded-full px-4 py-2 transition-all duration-300 hover:bg-emerald-300 hover:text-emerald-700 lg:px-5 lg:py-3  "
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Link
        to={user ? "/profile" : "/login"}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : user ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-300 font-black text-emerald-900">
            {user.name.charAt(0).toUpperCase()}
          </span>
        ) : null}
        <span>{user ? user.name : "Profile"}</span>
      </Link>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          />
          <aside className="fixed bottom-0 left-0 top-0 z-50 w-72 bg-emerald-50 p-6 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-emerald-800">Menu</p>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-600 hover:bg-emerald-100"
              >
                ×
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-xl bg-emerald-200 px-4 py-3 font-bold text-emerald-800"
                      : "rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-emerald-100 hover:text-emerald-800"
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
          </aside>
        </>
      )}
      <Link
        to="/cart"
        aria-label={`Open cart${itemCount > 0 ? ` with ${itemCount} items` : ""}`}
        className="fixed bottom-10 right-10 z-30 flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-xl shadow-emerald-900/20 transition-transform hover:scale-105 hover:bg-emerald-800"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H6" />
          <circle cx="10" cy="20" r="1.2" />
          <circle cx="18" cy="20" r="1.2" />
        </svg>
        <span>CART</span>
        {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-700 px-1 text-xs font-black text-white">{itemCount}</span>}
      </Link>
    </nav>
  );
};

export default Navbar;
