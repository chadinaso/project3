import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginPage from './components/auth/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import CustomerManagement from './components/admin/CustomerManagement';
import SalesReport from './components/admin/SalesReport';
import Settings from './components/admin/Settings';
import CustomerLayout from './components/customer/CustomerLayout';
import ProductCatalog from './components/customer/ProductCatalog';
import Cart from './components/customer/Cart';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [adminPage, setAdminPage] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPage />;
  }

  if (profile.role === 'admin') {
    return (
      <AdminLayout currentPage={adminPage} onNavigate={setAdminPage}>
        {adminPage === 'dashboard' && <Dashboard />}
        {adminPage === 'products' && <ProductManagement />}
        {adminPage === 'orders' && <OrderManagement />}
        {adminPage === 'customers' && <CustomerManagement />}
        {adminPage === 'reports' && <SalesReport />}
        {adminPage === 'settings' && <Settings />}
      </AdminLayout>
    );
  }

  return (
    <CustomerLayout onSearch={setSearchTerm} onCartClick={() => setShowCart(true)}>
      <ProductCatalog searchTerm={searchTerm} />
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </CustomerLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
