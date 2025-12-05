import { ReactNode, useState, useEffect } from 'react';
import { Leaf, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type Props = {
  children: ReactNode;
  currentPage: 'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings';
  onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings') => void;
};

export default function AdminLayout({ children, currentPage, onNavigate }: Props) {
  const { signOut, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    loadNewOrdersCount();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadNewOrdersCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNewOrdersCount = async () => {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('خطأ في تحميل عدد الطلبات:', error);
      return;
    }

    if (count !== null) {
      console.log('عدد الطلبات الجديدة:', count);
      setNewOrdersCount(count);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'الرئيسية', icon: Leaf },
    { id: 'products' as const, label: 'إدارة المنتجات', icon: Package },
    { id: 'orders' as const, label: 'إدارة الطلبات', icon: ShoppingCart },
    { id: 'customers' as const, label: 'إدارة الزبائن', icon: Users },
    { id: 'reports' as const, label: 'تقارير المبيعات', icon: BarChart3 },
    { id: 'settings' as const, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="lg:hidden fixed top-0 right-0 left-0 bg-green-800 text-white p-4 z-50 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          {newOrdersCount > 0 && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 min-w-[50px] justify-center">
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>{newOrdersCount}</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 hover:bg-green-700 rounded-lg transition"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="hidden lg:block fixed top-0 left-0 right-64 bg-white shadow-sm z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-gray-700">
              <p className="text-sm text-gray-500">مرحباً،</p>
              <p className="font-semibold">{profile?.full_name}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-green-800 text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <img src="/jara.jpg" alt="جارة القمر" className="h-24 w-auto mb-3" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>

          <div className="mb-6">
            <p className="text-green-200 text-sm">مرحباً،</p>
            <p className="font-semibold">{profile?.full_name}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
                    currentPage === item.id
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.id === 'orders' && newOrdersCount > 0 && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 min-w-[50px] justify-center">
                        <Bell className="w-3.5 h-3.5 animate-bounce" />
                        <span>{newOrdersCount}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-700 transition mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:mr-64 pt-16 lg:pt-20">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
