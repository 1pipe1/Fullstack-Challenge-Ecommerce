import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
