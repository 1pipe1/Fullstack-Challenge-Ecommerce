import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/admin", label: "📊 Dashboard" },
    { to: "/admin/stock", label: "📦 Stock" },
    { to: "/admin/sales", label: "💰 Ventas" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-6">
      <h1 className="text-xl font-bold text-orange-500 mb-8">🛒 Nexo Admin</h1>
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white font-semibold"
                  : "hover:bg-gray-700 text-gray-300"
              }`
            }
          >
            {link.label}
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
  );
};

export default AdminSidebar;
