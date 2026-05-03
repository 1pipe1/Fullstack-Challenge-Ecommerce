import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/organisms/AdminSidebar";
import useAuthStore from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const AdminLayout = () => {
  const { user, isAdmin } = useAuthStore();

  if (!user || !isAdmin()) return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet /> {/* aquí se renderizan Dashboard, Stock o Ventas */}
      </main>
    </div>
  );
};

export default AdminLayout;
