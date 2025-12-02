import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

type Props = {
  onClose: () => void;
};

export default function Cart({ onClose }: Props) {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleConfirmOrder = async () => {
    if (!user || !profile) {
      setError('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (items.length === 0) {
      setError('السلة فارغة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const item of items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product.id)
          .single();

        if (productError) throw productError;

        if (!product || product.quantity < item.quantity) {
          throw new Error(`الكمية غير كافية للمنتج: ${item.product.name}. الكمية المتاحة: ${product?.quantity || 0}`);
        }
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          phone: profile.phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      const invoiceResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderData.id,
            phone: profile.phone,
            customerName: profile.full_name,
            area: profile.area || '',
            detailedAddress: profile.detailed_address || '',
            items: items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              image: item.product.image_url,
            })),
            totalAmount,
          }),
        }
      );

      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      }

      clearCart();
      setOrderSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تم تأكيد طلبك بنجاح!</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              شكراً لك على شرائك منتجاتنا العضوية، سنلبي طلبك في أسرع وقت ممكن
            </p>
            <p className="text-md text-gray-600 mt-4">دمتم في رعاية الله وحفظه</p>
          </div>
          <button
            onClick={() => {
              setOrderSuccess(false);
              onClose();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-green-700 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold">سلة التسوق</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-800 rounded-full transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">السلة فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base truncate">{item.product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      ${item.product.price.toFixed(2)} × {item.quantity}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 transition disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <p className="font-bold text-green-700 text-sm sm:text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-base sm:text-xl font-bold text-gray-800">المجموع الكلي:</span>
              <span className="text-2xl sm:text-3xl font-bold text-green-700">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition disabled:opacity-50"
            >
              {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
