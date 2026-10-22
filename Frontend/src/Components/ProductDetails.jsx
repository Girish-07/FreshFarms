import { Link, useParams } from "react-router-dom";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { getUnit } from "../utils/market";
import { api } from "../utils/api";
import { useCartStore } from "../store/cartStore";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const loadedProduct = await api.getProduct(productId);
        setProduct(loadedProduct);
        const loadedProducts = await api.getProducts(`category=${encodeURIComponent(loadedProduct.category)}`);
        setRelatedProducts(loadedProducts);
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    loadProductDetails();
  }, [productId]);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (error) {
    return (
      <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-black">{error}</h1>
        <Link to="/products" className="mt-5 inline-block font-bold text-emerald-700">
          Back to products
        </Link>
      </main>
    );
  }
  if (!product) return <main className="min-h-screen bg-emerald-50 px-6 py-20 text-center"><p className="text-slate-500">Loading product...</p></main>;

  const addToCart = () => {
    Array.from({ length: quantity }).forEach(() => addItem(product));
  };

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-10 text-slate-900 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/products" className="font-bold text-emerald-700">
          ← Back to products
        </Link>
        <div className="mt-8 grid gap-8 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full rounded-2xl object-cover sm:h-[440px]"
          />
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {product.category}
            </span>
            <h1 className="mt-4 text-3xl font-black sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-orange-600">{product.rating} ★ · Fresh and carefully packed</p>
            <p className="mt-6 leading-7 text-slate-600">Sold By: <span className="font-bold  underline"> {product.farmer}</span></p>
            <p className="mt-6 leading-7 text-slate-600 font-bold">{product.desc}</p>
            <div className="mt-8 flex items-center gap-3">
              <p className="text-3xl font-black">{product.price}</p>
              <del className="text-slate-400">{product.oldPrice}</del>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center rounded-full border border-emerald-200">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 font-bold text-emerald-700">−</button>
                <span className="min-w-8 text-center font-bold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="px-4 py-2 font-bold text-emerald-700">+</button>
              </div>
              <button type="button" onClick={addToCart} className="flex-1 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800">
                Add {quantity} {getUnit(product.price)}{quantity > 1 ? "s" : ""} to cart
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-500">✓ Freshly packed · ✓ Fair pricing · ✓ Delivery across your area</p>
          </div>
        </div>
        <section className="mt-14">
          <h2 className="text-2xl font-black">You may also like</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.filter((item) => item.name !== product.name).slice(0, 3).map((item) => (
              <ProductCard key={item.name} product={item} />
            ))}
          </div>
        </section>
      </div>
      <div className="mt-16"><Footer /></div>
    </main>
  );
};

export default ProductDetails;
