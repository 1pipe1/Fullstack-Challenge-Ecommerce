import { useState } from "react";
import useCartStore from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import useAuthStore from "../store/useAuthStore";

const CheckoutPage = () => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = getTotalPrice();

  const handleConfirmPurchase = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        items: cart.map((item) => ({
          id: item.id,
          name: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          userEmail: user?.email || "guest",
        })),
        total: totalPrice,
        createdAt: serverTimestamp(),
        status: "completed",
      });

      for (const item of cart) {
        const productRef = doc(db, "products", item.id);
        const productSnapshot = await getDoc(productRef);
        const productData = productSnapshot.data();
        await updateDoc(productRef, {
          stock: productData.stock - item.quantity,
        });
      }

      clearCart();
      setPurchaseSuccess(true);
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pantalla de éxito — clara y cálida
  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">
            ¡Pedido recibido!
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Tu compra fue procesada con éxito.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Pronto nos pondremos en contacto contigo.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  // 🛒 Carrito vacío
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-8">
            Agrega productos antes de continuar.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  // 📋 Resumen de compra
  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🧾 Tu pedido
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                {/* Imagen del producto */}
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-100"
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-base leading-tight">
                    {item.title || item.name}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Cantidad: <span className="font-bold text-gray-700">{item.quantity}</span>
                  </p>
                </div>

                {/* Precio */}
                <div className="text-right">
                  <p className="font-bold text-orange-500 text-lg">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    ${item.price.toLocaleString()} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-700">Total a pagar:</span>
            <span className="text-2xl font-bold text-orange-500">
              ${totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Botón confirmar */}
          <button
            onClick={handleConfirmPurchase}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 rounded-xl text-xl transition-colors mb-3"
          >
            {loading ? "Procesando..." : "✅ Confirmar pedido"}
          </button>

          {/* Botón cancelar */}
          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-colors"
          >
            Cancelar y volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;