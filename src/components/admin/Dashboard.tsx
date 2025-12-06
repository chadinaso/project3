import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todaySales: 0,
    newOrders: 0,
  });
  const [diagnostics, setDiagnostics] = useState({
    role: '',
    canReadOrders: false,
    errorMessage: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [productsRes, ordersRes, customersRes, todayOrdersRes, newOrdersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', new Date().toISOString().split('T')[0]),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const todaySales = todayOrdersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setDiagnostics({
      role: profile?.role || 'غير معروف',
      canReadOrders: !ordersRes.error,
      errorMessage: ordersRes.error?.message || newOrdersRes.error?.message || '',
    });

    console.log('معلومات التشخيص:', {
      role: profile?.role,
      ordersError: ordersRes.error,
      newOrdersError: newOrdersRes.error,
      newOrdersCount: newOrdersRes.count,
    });

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalCustomers: customersRes.count || 0,
      todaySales,
      newOrders: newOrdersRes.count || 0,
    });
  };

  const statCards = [
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-600',
    },
    {
      title: 'طلبات جديدة',
      value: stats.newOrders,
      icon: ShoppingCart,
      color: 'bg-red-500',
    },
    {
      title: 'عدد الزبائن',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'مبيعات اليوم',
      value: `$${stats.todaySales.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">لوحة المعلومات</h1>

      {diagnostics.errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800 mb-1">تحذير: خطأ في الصلاحيات</h3>
            <p className="text-red-700 text-sm mb-2">{diagnostics.errorMessage}</p>
            <p className="text-red-600 text-sm">
              <strong>الدور الحالي:</strong> {diagnostics.role}
            </p>
            <p className="text-red-600 text-sm">
              <strong>الصلاحيات:</strong> {diagnostics.canReadOrders ? 'يمكن القراءة' : 'لا يمكن القراءة'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">{card.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.color} p-2 sm:p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">نظرة عامة</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          مرحباً بك في لوحة التحكم الخاصة بمتجر المنتجات العضوية. يمكنك من هنا إدارة المنتجات والطلبات
          والزبائن.
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>معلومات الحساب:</strong> {profile?.full_name} ({diagnostics.role})
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>عدد الطلبات الجديدة:</strong> {stats.newOrders}
          </p>
        </div>
      </div>
    </div>
  );
}
