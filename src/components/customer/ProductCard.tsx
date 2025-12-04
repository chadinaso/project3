import { Plus, Minus } from 'lucide-react';
import { Product } from '../../lib/supabase';
import { useCart } from '../../contexts/CartContext';

type Props = {
  product: Product;
  onViewDetails: (product: Product) => void;
};

export default function ProductCard({ product, onViewDetails }: Props) {
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
    const newQuantity = (cartItem?.quantity || 1) - 1;
    updateQuantity(product.id, newQuantity);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
      <div
        onClick={() => onViewDetails(product)}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
          />
          {product.sugar_free && (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              خالي من السكر
            </span>
          )}
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                الكمية نفذت
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</span>
            {product.weight && (
              <span className="text-sm text-gray-500">{product.weight}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${
              product.quantity === 0
                ? 'text-red-600'
                : product.quantity <= 5
                  ? 'text-orange-600'
                  : 'text-gray-600'
            }`}>
              {product.quantity === 0
                ? 'الكمية نفذت'
                : `متوفر: ${product.quantity} قطعة`}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        {product.quantity > 0 ? (
          cartItem ? (
            <div className="flex items-center justify-center gap-4 bg-green-50 border border-green-200 rounded-lg py-2">
              <button
                onClick={handleRemove}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold text-gray-800 text-lg min-w-[2rem] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleAdd}
                disabled={cartItem.quantity >= product.quantity}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 transition disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              أضف إلى السلة
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold cursor-not-allowed"
          >
            الكمية نفذت
          </button>
        )}
      </div>
    </div>
  );
}
