import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [newsMarquee, setNewsMarquee] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingOrders, setDeletingOrders] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'news_marquee')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setNewsMarquee(data.value);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'news_marquee')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({
            value: newsMarquee,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('key', 'news_marquee');

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({
            key: 'news_marquee',
            value: newsMarquee,
            updated_by: user?.id,
          });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء حفظ الإعدادات' });
    } finally {
      setLoading(false);
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    setDeletingOrders(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حذف جميع الطلبات بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء حذف الطلبات' });
    } finally {
      setDeletingOrders(false);
    }
  };

  const deleteConfirmedOrders = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الطلبات المؤكدة؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    setDeletingOrders(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('status', 'confirmed');

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حذف جميع الطلبات المؤكدة بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء حذف الطلبات' });
    } finally {
      setDeletingOrders(false);
    }
  };

  const deleteCancelledOrders = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الطلبات الملغاة؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    setDeletingOrders(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('status', 'cancelled');

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حذف جميع الطلبات الملغاة بنجاح!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء حذف الطلبات' });
    } finally {
      setDeletingOrders(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-green-600" />
          الإعدادات
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">شريط الأخبار المتحرك</h2>
            <p className="text-gray-600 mb-4">
              النص الذي سيظهر في شريط الأخبار المتحرك أعلى الصفحة الرئيسية للزبائن
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نص شريط الأخبار
              </label>
              <textarea
                value={newsMarquee}
                onChange={(e) => setNewsMarquee(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="مثال: عروض خاصة على جميع المنتجات! - خصم 20% على العسل الطبيعي"
              />
              <p className="text-sm text-gray-500 mt-2">
                يمكنك إضافة معلومات عن المنتجات الجديدة، العروض الخاصة، أو أي إعلانات مهمة
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">معاينة:</p>
              <div className="bg-green-700 text-white py-2 px-4 rounded overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {newsMarquee || 'مرحباً بكم في جارة القمر - منتجات عضوية طبيعية 100%'}
                </div>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">إدارة الطلبات</h2>
            <p className="text-gray-600 mb-6">
              احذف الطلبات من قاعدة البيانات. تحذير: هذا الإجراء لا يمكن التراجع عنه!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">حذف جميع الطلبات</h3>
                <p className="text-sm text-red-600 mb-4">
                  سيتم حذف جميع الطلبات بغض النظر عن حالتها
                </p>
                <button
                  onClick={deleteAllOrders}
                  disabled={deletingOrders}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  {deletingOrders ? 'جاري الحذف...' : 'حذف الكل'}
                </button>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <h3 className="font-bold text-orange-800 mb-2">حذف الطلبات المؤكدة</h3>
                <p className="text-sm text-orange-600 mb-4">
                  سيتم حذف الطلبات التي تم تأكيدها فقط
                </p>
                <button
                  onClick={deleteConfirmedOrders}
                  disabled={deletingOrders}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  {deletingOrders ? 'جاري الحذف...' : 'حذف المؤكدة'}
                </button>
              </div>

              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">حذف الطلبات الملغاة</h3>
                <p className="text-sm text-gray-600 mb-4">
                  سيتم حذف الطلبات الملغاة من قبل المدير فقط
                </p>
                <button
                  onClick={deleteCancelledOrders}
                  disabled={deletingOrders}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  {deletingOrders ? 'جاري الحذف...' : 'حذف الملغاة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
