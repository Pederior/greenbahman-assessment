import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import UsersPage from '../features/dashboard/UsersPage';
import ProductsPage from '../features/dashboard/ProductsPage';
// import DemoSelect from '../features/ui-kit/DemoSelect';
import GamesPage from '../features/games/GamesPage';
import GameDetailPage from '../features/games/GameDetailPage';
import DashboardHome from '../features/dashboard/DashboardHome';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
    ],
  },
  {
    path: '/games',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <GamesPage />,
      },
      {
        path: ':id',
        element: <GameDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);