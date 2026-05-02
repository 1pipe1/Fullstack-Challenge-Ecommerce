import Button from "../atoms/Button";
import Price from "../atoms/Price";
import useCartStore from "../../store/useCartStore";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col text-center">
      <div className="h-48 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <h2 className="text-xl font-bold mb-3 text-[#0F172A] h-12 line-clamp-2">
        {product.title}
      </h2>
      <p className="text-sm text-gray-600 mb-4">{product.category}</p>
      <Price amount={product.price} />
      {product.stock && (
        <p className="text-sm text-gray-600 mb-4">{product.stock} en stock</p>
      )}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-1 bg-gray-200 rounded-full"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-1 bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
      <Button
        text="Agregar al carrito"
        onClick={() => addToCart({ ...product, quantity })}
        className="mt-auto"
      />
    </div>
  );
};

export default ProductCard;
