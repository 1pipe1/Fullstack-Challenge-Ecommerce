import { useEffect, useState } from "react";
import useStockStore from "../store/useStockStore";
import useAuthStore from "../store/useAuthStore";

const AdminPage = () => {
  const products = useStockStore((state) => state.products);
  const fetchProducts = useStockStore((state) => state.fetchProducts);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetchProducts().then(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <p className="text-gray-600">Cargando productos...</p>
      </div>
        );
    
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
          <p className="text-gray-600">No tienes permiso para acceder a esta página</p>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen bg-[#F0F4F8] p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administrador</h1>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-3 text-left">Producto</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="p-3 flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm font-medium">{product.title}</span>
              </td>
              <td className="p-3 text-sm text-gray-500">{product.category}</td>
              <td className="p-3 text-sm font-semibold text-orange-500">
                ${product.price}
              </td>
              <td className="p-3 text-sm">{product.stock}</td>
              <td className="p-3 flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded">
                  Editar
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
