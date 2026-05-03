import { useEffect, useState } from "react";
import useStockStore from "../store/useStockStore";

const StockPage = () => {
  const products = useStockStore((state) => state.products);
  const fetchProducts = useStockStore((state) => state.fetchProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-8 text-gray-500">Cargando productos...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📦 Stock</h1>
      <table className="bg-white rounded-xl shadow overflow-hidden w-full">
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

export default StockPage;
