import { useEffect, useState } from 'react';
import { supabase, Order, OrderItem } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Calendar, Phone, MapPin } from 'lucide-react';

type OrderWithItems = Order & {
  items: OrderItem[];
};

export default function MyOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    if (profile?.id) {
      loadOrders();
    }
  }, [profile?.id]);

  const loadOrders = async () => {
    if (!profile?.id) return;

    setLoading(true);
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', profile.id)
      .order('created_at', { ascending: false });

    if (!error && ordersData) {
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return {
            ...order,
            items: items || [],
          };
        })
      );

      setOrders(ordersWithItems);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغي',
    };

    return (
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">لا توجد طلبات سابقة</p>
          <p className="text-gray-500 mt-2">قم بتصفح المنتجات وإضافة طلب جديد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">طلب رقم #{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  {getStatusBadge(order.status)}
                  <span className="text-xl font-bold text-green-700">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">المنتجات:</p>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-green-700">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{order.items.length - 2} منتجات أخرى
                    </p>
                  )}
                </div>
              </div>

              <button className="mt-3 text-green-600 hover:text-green-800 text-sm font-semibold">
                عرض التفاصيل الكاملة ←
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تفاصيل الطلب</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">رقم الطلب:</span>
                <span className="font-semibold">#{selectedOrder.id.slice(0, 8)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">التاريخ:</span>
                <span className="font-semibold">
                  {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">رقم الهاتف:</span>
                <span className="font-semibold">{selectedOrder.phone}</span>
              </div>

              {selectedOrder.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-700">العنوان:</span>
                    <p className="font-semibold">{selectedOrder.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-gray-700">الحالة:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">المنتجات</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        الكمية: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-green-700 flex-shrink-0">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-800">المجموع الكلي:</span>
                <span className="text-green-700">${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
