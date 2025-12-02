import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todaySales: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [productsRes, ordersRes, customersRes, todayOrdersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', new Date().toISOString().split('T')[0]),
    ]);

    const todaySales = todayOrdersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalCustomers: customersRes.count || 0,
      todaySales,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </div>
    </div>
  );
}
