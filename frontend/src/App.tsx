import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UsersPage from './features/dashboard/UsersPage';
import ProductsPage from './features/dashboard/ProductsPage';
import DemoSelect from './features/ui-kit/DemoSelect';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;