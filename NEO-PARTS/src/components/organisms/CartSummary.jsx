import useCartStore from "../../store/useCartStore";

const CartSummary = () => {
  const cart = useCartStore((state) => state.cart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  // Sumamos todos los precios. Usamos Number() para evitar que el motor "patee"
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl max-w-sm ml-auto">
      <h2 className="text-xl font-bold text-orange-500 mb-4">
        Resumen de Venta
      </h2>

      <div className="flex justify-between text-gray-300 mb-2">
        <span>Productos:</span>
        <span>{getTotalItems()}</span>
      </div>

      <div className="flex justify-between text-2xl font-bold text-green-400 border-t border-gray-700 pt-4">
        <span>Total:</span>
        <span>${total.toLocaleString("es-CO")}</span>
      </div>

      <button
        className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all"
        onClick={() => alert("¡Venta registrada con éxito!")}
      >
        Finalizar Compra
      </button>
    </div>
  );
};

export default CartSummary;
