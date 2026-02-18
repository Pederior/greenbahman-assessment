import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./features/dashboard/UsersPage";
import ProductsPage from "./features/dashboard/ProductsPage";
import DemoSelect from "./features/ui-kit/DemoSelect";
import GamesPage from "./features/games/GamesPage";
import GameDetailPage from "./features/games/GameDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoSelect />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Navigate to="/dashboard/users" replace />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
