import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState<'select' | 'admin' | 'customer' | 'register'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [customArea, setCustomArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const areas = [
    'مشغرة',
    'لبايا',
    'سحمر',
    'يحمر',
    'عين زبدة',
    'قب الياس',
    'كفرزبد',
    'الماري',
    'كفرمشكي',
    'صغبين',
    'مكسة',
    'كفريا',
    'أخرى'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة');
        }
        if (!area) {
          throw new Error('يرجى اختيار المنطقة');
        }
        if (area === 'أخرى' && !customArea) {
          throw new Error('يرجى إدخال اسم المنطقة');
        }
        if (!detailedAddress) {
          throw new Error('يرجى إدخال العنوان التفصيلي');
        }
        await signUp(email, password, fullName, phone, area, customArea, detailedAddress);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ';
      setError(errorMessage);

      // إذا كان الخطأ متعلق برقم الهاتف المكرر، نبقى في صفحة التسجيل
      if (errorMessage.includes('هذا الرقم مسجل من قبل')) {
        // يبقى في وضع register
        setLoading(false);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/jara.jpg" alt="جارة القمر" className="h-32 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">منتوجات قلب القمر العضوية</h1>
            <p className="text-gray-600">مشغرة</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('admin')}
              className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-lg font-semibold transition"
            >
              دخول كمدير
            </button>
            <button
              onClick={() => setMode('customer')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition"
            >
              دخول كزبون
            </button>
            <button
              onClick={() => setMode('register')}
              className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 py-4 rounded-lg font-semibold transition"
            >
              تسجيل زبون جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img src="/jara.jpg" alt="جارة القمر" className="h-20 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">
            {mode === 'register' ? 'تسجيل حساب جديد' : mode === 'admin' ? 'دخول المدير' : 'دخول الزبون'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPhone(value);
                  }}
                  placeholder="96176123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">مثال: 96176123456</p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">المنطقة</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر المنطقة</option>
                  {areas.map((areaOption) => (
                    <option key={areaOption} value={areaOption}>
                      {areaOption}
                    </option>
                  ))}
                </select>
              </div>
              {area === 'أخرى' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">اسم المنطقة</label>
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="أدخل اسم المنطقة"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">العنوان التفصيلي</label>
                <textarea
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  placeholder="مثال: حي الزهراء، شارع الرئيسي، بناية السلام، الطابق الثالث"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              mode === 'admin' ? 'bg-green-800 hover:bg-green-900' : 'bg-green-600 hover:bg-green-700'
            } text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? (mode === 'register' ? 'جاري التسجيل...' : 'جاري تسجيل الدخول...') : mode === 'register' ? 'تسجيل' : 'دخول'}
          </button>

          <button
            type="button"
            onClick={() => setMode('select')}
            className="w-full text-gray-600 hover:text-gray-800 py-2"
          >
            رجوع
          </button>
        </form>
      </div>
    </div>
  );
}
