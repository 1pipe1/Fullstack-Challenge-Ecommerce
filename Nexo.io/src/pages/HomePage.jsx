import { useState, useEffect } from "react";
import ProductCard from "../components/molecules/ProductCard";
import Navbar from "../components/organisms/Navbar";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import useStockStore from "../store/useStockStore";
import useCartStore from "../store/useCartStore";

const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const products = useStockStore((state) => state.products);
  const fetchProducts = useStockStore((state) => state.fetchProducts);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  if (products.length === 0)
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );

  if (products.length === 0)
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-6">No se encontraron productos</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-gray-900">
      <Navbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onCheckout={() => navigate("/checkout")}
      />
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Bienvenido,{" "}
            <span className="text-orange-500">{user?.name || "Usuario"}</span>
          </h2>
          <button
            onClick={logout}
            className="bg-orange-600 hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && search && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron productos para "{search}"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-orange-500 font-semibold"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
