import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./Components/Dashboard";
import Farmers from "./Components/Farmers";
import Profile from "./Components/Profile";
import Addresses from "./Components/Addresses";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import ProductDetails from "./Components/ProductDetails";
import FarmerDetails from "./Components/FarmerDetails";
import OrderSuccess from "./Components/OrderSuccess";
import Register from "./Components/Register";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmers/:farmerId" element={<FarmerDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId/success" element={<OrderSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/orders/:orderNumber" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
