import { Link } from "react-router-dom";
import { getProductId } from "../utils/market";
import { useCartStore } from "../store/cartStore";

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const productId = getProductId(product);

  return (
    <article className="slow-card-hover flex min-h-[350px] flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-emerald-50 shadow-sm hover:border-emerald-500 sm:min-h-[420px]">
      <Link to={`/products/${productId}`} className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-32 w-full object-cover sm:h-44 lg:h-56"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85";
          }}
        />
        <span className="absolute left-2 top-2 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700 sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          {product.category === "Organic" || product.name.includes("Organic")
            ? "Organic"
            : product.category}
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-orange-100 px-2 py-1 text-[9px] font-bold text-orange-700 sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
          {product.discount}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Link to={`/products/${productId}`}>
          <h3 className="text-sm font-bold text-slate-950 sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
          {product.desc}
        </p>
        <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
          {product.farmer} ·{" "}
          <span className="font-bold text-orange-600">{product.rating} ★</span>
        </p>
        <div className="mt-auto flex flex-col items-stretch gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-black text-slate-950 sm:text-xl">
            {product.price}{" "}
            <del className="text-xs font-normal text-slate-400 sm:text-sm">
              {product.oldPrice}
            </del>
          </p>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="rounded-full border border-emerald-700 px-2 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-700 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
