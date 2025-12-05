import { useEffect, useState } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { Users, Phone, Mail, Calendar, Trash2 } from 'lucide-react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCustomers(data);
    }
    setLoading(false);
  };

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (!confirm(`هل أنت متأكد من حذف الزبون "${customerName}"؟ سيتم حذف جميع طلبات هذا الزبون أيضاً.`)) {
      return;
    }

    setDeletingId(customerId);
    try {
      const { data, error } = await supabase.functions.invoke('delete-customer', {
        body: { customerId },
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'فشل الاتصال بالخادم');
      }

      if (data && !data.success) {
        throw new Error(data.error || 'فشل حذف الزبون');
      }

      setCustomers(customers.filter(c => c.id !== customerId));
      alert('تم حذف الزبون بنجاح');
    } catch (error: any) {
      console.error('Delete customer error:', error);
      alert('خطأ في حذف الزبون: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">إدارة الزبائن</h1>

      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="بحث عن زبون..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap">الاسم</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap">الهاتف</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">البريد</th>
                <th className="px-2 sm:px-4 py-2 text-right text-xs sm:text-sm whitespace-nowrap hidden lg:table-cell">التاريخ</th>
                <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="w-3 h-3 text-gray-600 hidden sm:block" />
                      <span className="text-gray-800 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{customer.full_name}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Phone className="w-3 h-3 text-gray-600 hidden sm:block" />
                      <a
                        href={`https://wa.me/${customer.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline text-xs sm:text-sm whitespace-nowrap"
                      >
                        {customer.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Mail className="w-3 h-3 text-gray-600 hidden sm:block" />
                      <span className="text-gray-800 text-xs sm:text-sm truncate max-w-[150px]">{customer.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar className="w-3 h-3 text-gray-600 hidden sm:block" />
                      <span className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(customer.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.full_name)}
                        disabled={deletingId === customer.id}
                        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="حذف الزبون"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'لم يتم العثور على زبائن' : 'لا يوجد زبائن مسجلين'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">إحصائيات الزبائن</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          إجمالي الزبائن: <span className="font-bold text-green-700">{customers.length}</span>
        </p>
      </div>
    </div>
  );
}
