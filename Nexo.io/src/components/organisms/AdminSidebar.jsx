import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const AdminSidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/stock", label: "Stock", icon: "📦" },
    { to: "/admin/sales", label: "Ventas", icon: "💰" },
  ];

  return (
    <>
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex w-64 min-h-screen bg-gray-900 text-white flex-col p-6">
        <h1 className="text-xl font-bold text-orange-500 mb-4">
          🛒 Nexo Admin
        </h1>

        {/* Volver a tienda */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-orange-400 transition-colors mb-6"
        >
          ← Ver tienda
        </NavLink>

        <nav className="flex flex-col gap-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="px-4 py-3 rounded-lg bg-gray-700 hover:bg-red-600 transition-colors text-gray-300 text-left"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Barra inferior — solo móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 flex">
        {/* Botón tienda */}
        <NavLink
          to="/"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-gray-400 hover:text-orange-400 transition-colors"
        >
          <span className="text-xl mb-0.5">🏪</span>
          Tienda
        </NavLink>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 text-xs transition-colors ${
                isActive ? "text-orange-500 font-semibold" : "text-gray-400"
              }`
            }
          >
            <span className="text-xl mb-0.5">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          <span className="text-xl mb-0.5">🚪</span>
          Salir
        </button>
      </nav>
    </>
  );
};

export default AdminSidebar;
