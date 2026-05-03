import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const SalesPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // escucha en tiempo real 🔥
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data as any);
    });

    return () => unsub(); // limpia el listener al salir
  }, []);

  const totalVentas = orders.reduce((sum, o) => sum + ((o as any).total || 0), 0);
  const ordenesHoy = orders.filter((o) => {
    if (!(o as any).createdAt) return false;
    return (o as any).createdAt.toDate().toDateString() === new Date().toDateString();
  }).length;
  const promedio = orders.length ? totalVentas / orders.length : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💰 Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total ventas</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalVentas.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Órdenes hoy</p>
          <p className="text-3xl font-bold text-blue-600">{ordenesHoy}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Promedio por orden</p>
          <p className="text-3xl font-bold text-purple-600">
            ${promedio.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Órdenes recientes</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">ID</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No hay órdenes aún
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={(o as any).id} className="border-t">
                  <td className="py-3 text-xs text-gray-400">
                    {(o as any).id.slice(0, 8)}...
                  </td>
                  <td className="py-3">{(o as any).userEmail || "—"}</td>
                  <td className="py-3 font-semibold text-green-600">
                    ${(o as any).total?.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Completada
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
