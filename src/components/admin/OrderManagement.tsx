import { useEffect, useState } from 'react';
import { supabase, Order, OrderItem, Profile } from '../../lib/supabase';
import { Package, Calendar, User, Phone } from 'lucide-react';

type OrderWithDetails = Order & {
  items: OrderItem[];
  customer: Profile;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && ordersData) {
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          const [itemsRes, customerRes] = await Promise.all([
            supabase.from('order_items').select('*').eq('order_id', order.id),
            supabase.from('profiles').select('*').eq('id', order.customer_id).single(),
          ]);

          return {
            ...order,
            items: itemsRes.data || [],
            customer: customerRes.data,
          };
        })
      );

      setOrders(ordersWithDetails);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      if (status === 'confirmed') {
        sendInvoiceToWhatsApp(orderId);
        sendConfirmationToCustomer(orderId);
      }
    }
  };

  const sendInvoiceToWhatsApp = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: order.id,
          phone: order.phone,
          customerName: order.customer?.full_name || 'زبون',
          items: order.items.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            image: item.product_image,
          })),
          totalAmount: order.total_amount,
        }),
      });

      const data = await response.json();

      if (data.success && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const sendConfirmationToCustomer = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          phone: order.phone,
          customerName: order.customer?.full_name || 'زبون',
        }),
      });

      const data = await response.json();

      if (data.success && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
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
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة الطلبات</h1>
        {pendingOrdersCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-3 sm:px-4 py-2 rounded-lg border-2 border-yellow-300 flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">طلبيات جديدة</span>
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
              {pendingOrdersCount}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap">رقم الطلب</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap hidden lg:table-cell">الزبون</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap">المبلغ</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap">الحالة</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">التاريخ</th>
                <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 text-xs sm:text-sm whitespace-nowrap">#{order.id.slice(0, 8)}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 text-xs sm:text-sm hidden lg:table-cell">
                    <span className="truncate max-w-[150px] inline-block">{order.customer?.full_name || '-'}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 font-semibold text-xs sm:text-sm whitespace-nowrap">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                    {new Date(order.created_at).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-green-600 hover:text-green-800 font-semibold text-xs sm:text-sm whitespace-nowrap"
                    >
                      تفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد طلبات حالياً</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تفاصيل الطلب</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-gray-700 text-xs sm:text-sm">رقم الطلب:</span>
                <span className="font-semibold text-xs sm:text-sm">#{selectedOrder.id.slice(0, 8)}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-gray-700 text-xs sm:text-sm">اسم الزبون:</span>
                <span className="font-semibold text-xs sm:text-sm">{selectedOrder.customer?.full_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-gray-700 text-xs sm:text-sm">رقم الهاتف:</span>
                {selectedOrder.status === 'confirmed' ? (
                  <button
                    onClick={() => sendConfirmationToCustomer(selectedOrder.id)}
                    className="font-semibold text-green-600 hover:text-green-800 hover:underline text-xs sm:text-sm"
                  >
                    {selectedOrder.phone}
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${selectedOrder.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-green-600 hover:text-green-800 hover:underline text-xs sm:text-sm"
                  >
                    {selectedOrder.phone}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-gray-700 text-xs sm:text-sm">التاريخ:</span>
                <span className="font-semibold text-xs sm:text-sm">
                  {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-xs sm:text-sm">الحالة:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">المنتجات</h3>
              <div className="space-y-2 sm:space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 sm:gap-4 bg-gray-50 p-2 sm:p-3 rounded-lg"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{item.product_name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        الكمية: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-green-700 text-xs sm:text-sm flex-shrink-0">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
              <div className="flex justify-between items-center text-base sm:text-xl font-bold">
                <span className="text-gray-800">المجموع الكلي:</span>
                <span className="text-green-700">${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                  >
                    إلغاء
                  </button>
                </>
              )}
              {selectedOrder.status !== 'pending' && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 sm:py-3 rounded-lg font-semibold transition text-xs sm:text-sm"
                >
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
