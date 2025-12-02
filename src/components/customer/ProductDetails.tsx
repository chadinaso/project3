import { X, Plus, Minus } from 'lucide-react';
import { Product } from '../../lib/supabase';
import { useCart } from '../../contexts/CartContext';

type Props = {
  product: Product;
  onClose: () => void;
};

export default function ProductDetails({ product, onClose }: Props) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);

  const handleAdd = () => {
    if (!cartItem) {
      addItem(product);
    } else {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleRemove = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تفاصيل المنتج</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-6">
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">{product.category}</p>
              </div>
              {product.sugar_free && (
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  خالي من السكر
                </span>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-green-700">${product.price.toFixed(2)}</span>
              {product.weight && (
                <span className="text-sm sm:text-base text-gray-600 mr-2 sm:mr-3">({product.weight})</span>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">الوصف</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="mb-6">
              <p className={`text-sm font-semibold ${product.quantity === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {product.quantity === 0
                  ? 'الكمية نفذت'
                  : `الكمية المتاحة: ${product.quantity}`}
              </p>
            </div>

            {product.quantity > 0 && (
              <div className="sticky bottom-0 bg-white pt-3 sm:pt-4 border-t border-gray-200">
                {cartItem ? (
                  <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <button
                      onClick={handleRemove}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 sm:p-3 transition"
                    >
                      <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <span className="font-bold text-gray-800 text-xl sm:text-2xl min-w-[2.5rem] sm:min-w-[3rem] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={handleAdd}
                      disabled={cartItem.quantity >= product.quantity}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 sm:p-3 transition disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      المجموع: ${(cartItem.quantity * product.price).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                    أضف إلى السلة
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
