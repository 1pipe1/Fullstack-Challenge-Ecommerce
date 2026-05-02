import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  if (!hydrated) {
    return null;
  }
  
  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/checkout"
        element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />}
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
