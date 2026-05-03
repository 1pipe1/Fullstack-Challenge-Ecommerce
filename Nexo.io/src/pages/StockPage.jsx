import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import useStockStore from "../store/useStockStore";

const emptyForm = { title: "", category: "", price: "", stock: "", image: "" };

const StockPage = () => {
  const products = useStockStore((state) => state.products);
  const fetchProducts = useStockStore((state) => state.fetchProducts);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts().then(() => setLoading(false));
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: form.title,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image: form.image,
    };

    if (editingProduct) {
      await updateDoc(doc(db, "products", editingProduct.id), data);
    } else {
      await addDoc(collection(db, "products"), data);
    }

    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
    fetchProducts();
  };

  if (loading)
    return <p className="p-8 text-gray-500">Cargando productos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Stock</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          + Agregar producto
        </button>
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar producto" : "Agregar producto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Nombre"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Categoría"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Precio"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="URL de imagen"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
                >
                  {editingProduct ? "Guardar cambios" : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded"
                >
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
