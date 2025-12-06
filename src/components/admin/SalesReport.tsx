import { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, TrendingUp, FileText, Download, FileText as FileTextIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type ReportType = 'daily' | 'comprehensive';

type DailySales = {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
};

type ProductSales = {
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
};

type OrderDetail = {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
};

export default function SalesReport() {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState<DailySales | null>(null);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (reportType === 'daily') {
      loadDailyReport();
    } else {
      loadComprehensiveReport();
    }
  }, [reportType, selectedDate, dateRange]);

  const loadDailyReport = async () => {
    setLoading(true);
    try {
      const startOfDay = `${selectedDate}T00:00:00`;
      const endOfDay = `${selectedDate}T23:59:59`;

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          customer_id,
          profiles:customer_id(full_name, phone)
        `)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // احتساب المبيعات فقط من الطلبات المؤكدة
      const confirmedOrdersList = orders?.filter(o => o.status === 'confirmed') || [];
      const totalOrders = confirmedOrdersList.length;
      const totalRevenue = confirmedOrdersList.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const confirmedOrders = confirmedOrdersList.length;
      const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

      setDailySales({
        date: selectedDate,
        totalOrders,
        totalRevenue,
        pendingOrders,
        confirmedOrders,
        cancelledOrders,
      });

      const orderDetailsData: OrderDetail[] = orders?.map(order => ({
        id: order.id,
        created_at: order.created_at,
        total_amount: order.total_amount,
        status: order.status,
        customer_name: order.profiles?.full_name || 'غير متوفر',
        customer_phone: order.profiles?.phone || 'غير متوفر',
      })) || [];
      setOrderDetails(orderDetailsData);

      // احتساب المنتجات فقط من الطلبات المؤكدة
      const confirmedOrderIds = confirmedOrdersList.map(o => o.id);
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_name, quantity, price, order_id')
        .in('order_id', confirmedOrderIds);

      if (itemsError) throw itemsError;

      const productMap = new Map<string, ProductSales>();
      items?.forEach(item => {
        const existing = productMap.get(item.product_name);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalRevenue += item.quantity * item.price;
        } else {
          productMap.set(item.product_name, {
            productName: item.product_name,
            totalQuantity: item.quantity,
            totalRevenue: item.quantity * item.price,
          });
        }
      });

      setProductSales(Array.from(productMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue));
    } catch (error) {
      console.error('Error loading daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComprehensiveReport = async () => {
    setLoading(true);
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          customer_id,
          profiles:customer_id(full_name, phone)
        `)
        .gte('created_at', `${dateRange.from}T00:00:00`)
        .lte('created_at', `${dateRange.to}T23:59:59`)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // احتساب المبيعات فقط من الطلبات المؤكدة
      const confirmedOrdersList = orders?.filter(o => o.status === 'confirmed') || [];
      const totalOrders = confirmedOrdersList.length;
      const totalRevenue = confirmedOrdersList.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const confirmedOrders = confirmedOrdersList.length;
      const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;

      setDailySales({
        date: `${dateRange.from} - ${dateRange.to}`,
        totalOrders,
        totalRevenue,
        pendingOrders,
        confirmedOrders,
        cancelledOrders,
      });

      const orderDetailsData: OrderDetail[] = orders?.map(order => ({
        id: order.id,
        created_at: order.created_at,
        total_amount: order.total_amount,
        status: order.status,
        customer_name: order.profiles?.full_name || 'غير متوفر',
        customer_phone: order.profiles?.phone || 'غير متوفر',
      })) || [];
      setOrderDetails(orderDetailsData);

      // احتساب المنتجات فقط من الطلبات المؤكدة
      const confirmedOrderIds = confirmedOrdersList.map(o => o.id);
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_name, quantity, price, order_id')
        .in('order_id', confirmedOrderIds);

      if (itemsError) throw itemsError;

      const productMap = new Map<string, ProductSales>();
      items?.forEach(item => {
        const existing = productMap.get(item.product_name);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalRevenue += item.quantity * item.price;
        } else {
          productMap.set(item.product_name, {
            productName: item.product_name,
            totalQuantity: item.quantity,
            totalRevenue: item.quantity * item.price,
          });
        }
      });

      setProductSales(Array.from(productMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue));
    } catch (error) {
      console.error('Error loading comprehensive report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReportJSON = () => {
    const reportData = {
      type: reportType === 'daily' ? 'تقرير يومي' : 'تقرير شامل',
      date: dailySales?.date,
      summary: dailySales,
      products: productSales,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `sales-report-${reportType}-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  };

  const exportReportText = () => {
    if (!dailySales) return;

    const reportTitle = reportType === 'daily' ? 'تقرير المبيعات اليومي' : 'تقرير المبيعات الشامل';
    const reportDate = dailySales.date;

    let textContent = `${'='.repeat(60)}\n`;
    textContent += `${reportTitle}\n`;
    textContent += `التاريخ: ${reportDate}\n`;
    textContent += `تم الإنشاء: ${new Date().toLocaleString('ar-EG')}\n`;
    textContent += `${'='.repeat(60)}\n\n`;

    textContent += `ملخص المبيعات\n`;
    textContent += `${'-'.repeat(60)}\n`;
    textContent += `إجمالي الطلبات: ${dailySales.totalOrders}\n`;
    textContent += `إجمالي الإيرادات: $${dailySales.totalRevenue.toFixed(2)}\n`;
    textContent += `طلبات معلقة: ${dailySales.pendingOrders}\n`;
    textContent += `طلبات مؤكدة: ${dailySales.confirmedOrders}\n`;
    textContent += `طلبات ملغاة: ${dailySales.cancelledOrders}\n`;
    const avgOrder = dailySales.totalOrders > 0 ? dailySales.totalRevenue / dailySales.totalOrders : 0;
    textContent += `متوسط قيمة الطلب: $${avgOrder.toFixed(2)}\n`;
    textContent += `\n`;

    textContent += `تفاصيل مبيعات المنتجات\n`;
    textContent += `${'-'.repeat(60)}\n`;

    productSales.forEach((product, index) => {
      textContent += `${index + 1}. ${product.productName}\n`;
      textContent += `   الكمية: ${product.totalQuantity}\n`;
      textContent += `   الإيرادات: $${product.totalRevenue.toFixed(2)}\n`;
      textContent += `\n`;
    });

    const totalQuantity = productSales.reduce((sum, p) => sum + p.totalQuantity, 0);
    const totalRevenue = productSales.reduce((sum, p) => sum + p.totalRevenue, 0);

    textContent += `${'-'.repeat(60)}\n`;
    textContent += `المجموع الكلي:\n`;
    textContent += `الكمية الإجمالية: ${totalQuantity}\n`;
    textContent += `الإيرادات الإجمالية: $${totalRevenue.toFixed(2)}\n`;
    textContent += `${'='.repeat(60)}\n`;

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
    const fileName = `تقرير-المبيعات-${reportType === 'daily' ? 'يومي' : 'شامل'}-${Date.now()}.txt`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  };


  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            تقارير المبيعات
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportReportText}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FileTextIcon className="w-5 h-5" />
              تصدير نص
            </button>
            <button
              onClick={exportReportJSON}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download className="w-5 h-5" />
              تصدير JSON
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setReportType('daily')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              reportType === 'daily'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-5 h-5 inline ml-2" />
            تقرير يومي
          </button>
          <button
            onClick={() => setReportType('comprehensive')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              reportType === 'comprehensive'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline ml-2" />
            تقرير شامل
          </button>
        </div>

        {reportType === 'daily' ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">اختر التاريخ</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">من تاريخ</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">إلى تاريخ</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقرير...</p>
        </div>
      ) : dailySales ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-blue-100 text-sm">إجمالي الطلبات</p>
                  <p className="text-4xl font-bold">{dailySales.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-green-100 text-sm">إجمالي الإيرادات</p>
                  <p className="text-4xl font-bold">${dailySales.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-yellow-100 text-sm">طلبات معلقة</p>
                  <p className="text-4xl font-bold">{dailySales.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-emerald-100 text-sm">طلبات مؤكدة</p>
                  <p className="text-4xl font-bold">{dailySales.confirmedOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-red-100 text-sm">طلبات ملغاة</p>
                  <p className="text-4xl font-bold">{dailySales.cancelledOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-12 h-12 opacity-80" />
                <div className="text-left">
                  <p className="text-purple-100 text-sm">متوسط قيمة الطلب</p>
                  <p className="text-4xl font-bold">
                    ${dailySales.totalOrders > 0 ? (dailySales.totalRevenue / dailySales.totalOrders).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              تفاصيل الطلبات
            </h2>

            {orderDetails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد طلبات في هذه الفترة</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">رقم الطلب</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">اسم العميل</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">رقم الهاتف</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المبلغ الإجمالي</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((order) => (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 transition ${
                          order.status === 'cancelled'
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-6 py-4 font-mono text-sm ${
                          order.status === 'cancelled' ? 'text-red-600' : 'text-gray-800'
                        }`}>
                          {order.id.slice(0, 8)}
                        </td>
                        <td className={`px-6 py-4 font-medium ${
                          order.status === 'cancelled' ? 'text-red-700' : 'text-gray-800'
                        }`}>
                          {order.customer_name}
                        </td>
                        <td className={`px-6 py-4 ${
                          order.status === 'cancelled' ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {order.customer_phone}
                        </td>
                        <td className={`px-6 py-4 font-bold ${
                          order.status === 'cancelled' ? 'text-red-700' : 'text-green-600'
                        }`}>
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'pending' ? 'معلق' : order.status === 'confirmed' ? 'مؤكد' : 'ملغي'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${
                          order.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {new Date(order.created_at).toLocaleString('ar-EG')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              مبيعات المنتجات
            </h2>

            {productSales.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد مبيعات في هذه الفترة</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">#</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">اسم المنتج</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الكمية المباعة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">إجمالي الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSales.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{product.productName}</td>
                        <td className="px-6 py-4 text-gray-800">{product.totalQuantity}</td>
                        <td className="px-6 py-4 text-green-600 font-bold">${product.totalRevenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="px-6 py-4 text-right text-gray-800">المجموع الكلي</td>
                      <td className="px-6 py-4 text-gray-800">
                        {productSales.reduce((sum, p) => sum + p.totalQuantity, 0)}
                      </td>
                      <td className="px-6 py-4 text-green-600">
                        ${productSales.reduce((sum, p) => sum + p.totalRevenue, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
