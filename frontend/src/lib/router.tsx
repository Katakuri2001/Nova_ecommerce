import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import Home from '../pages/Home';
import ProductListing from '../pages/ProductListing';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderTracking from '../pages/OrderTracking';
import Wishlist from '../pages/Wishlist';
import Account from '../pages/Account';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SellerDashboard from '../pages/SellerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminOrders from '../pages/AdminOrders';
import AdminProducts from '../pages/AdminProducts';
import AdminUsers from '../pages/AdminUsers';
import AdminAnalytics from '../pages/AdminAnalytics';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <ProductListing /> },
      { path: 'products', element: <ProductListing /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'account', element: <Account /> },
      { path: 'orders/:id', element: <OrderTracking /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'seller', element: <ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> },
      { path: 'admin/orders', element: <ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute> },
      { path: 'admin/products', element: <ProtectedRoute requiredRole="admin"><AdminProducts /></ProtectedRoute> },
      { path: 'admin/users', element: <ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute> },
      { path: 'admin/analytics', element: <ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute> },
    ],
  },
]);