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
import MyOrders from './components/customer/MyOrders';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [adminPage, setAdminPage] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings'>('dashboard');
  const [customerPage, setCustomerPage] = useState<'catalog' | 'orders'>('catalog');
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
    <CustomerLayout
      onSearch={setSearchTerm}
      onCartClick={() => setShowCart(true)}
      onOrdersClick={() => setCustomerPage('orders')}
    >
      {customerPage === 'catalog' && <ProductCatalog searchTerm={searchTerm} />}
      {customerPage === 'orders' && (
        <div>
          <button
            onClick={() => setCustomerPage('catalog')}
            className="mb-4 text-green-600 hover:text-green-800 font-semibold flex items-center gap-2"
          >
            ← العودة إلى المنتجات
          </button>
          <MyOrders />
        </div>
      )}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </CustomerLayout>
  );
}

export default function App() {
  try {
    return (
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في التطبيق</h1>
          <p className="text-gray-700 mb-4">حدث خطأ أثناء تحميل التطبيق</p>
          <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }
}
