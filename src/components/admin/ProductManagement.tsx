import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Package } from 'lucide-react';
import { supabase, Product } from '../../lib/supabase';

type ProductFormData = {
  name: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
  weight: string;
  image_url: string;
  sugar_free: boolean;
};

const CATEGORIES = [
  'مربى',
  'زعتر',
  'سمسم',
  'سماق',
  'مكدوس',
  'مخللات',
  'شطة',
  'ألبان',
  'أجبان',
  'زبيب',
  'حلوى بدون سكر',
  'أخرى',
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: CATEGORIES[0],
    description: '',
    price: '',
    quantity: '',
    weight: '',
    image_url: '',
    sugar_free: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      weight: formData.weight,
      image_url: formData.image_url,
      sugar_free: formData.sugar_free,
    };

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);

      if (!error) {
        loadProducts();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('products').insert(productData);

      if (!error) {
        loadProducts();
        resetForm();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      weight: product.weight || '',
      image_url: product.image_url,
      sugar_free: product.sugar_free,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('حدث خطأ أثناء حذف المنتج: ' + error.message);
      } else {
        loadProducts();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0],
      description: '',
      price: '',
      quantity: '',
      weight: '',
      image_url: '',
      sugar_free: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">إدارة المنتجات</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          إضافة منتج
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {editingId ? 'تعديل المنتج' : 'إضافة منتج'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">رابط الصورة</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="mt-2 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">اسم المنتج</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">التصنيف</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">السعر ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">الكمية</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">الوزن/الحجم</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="مثال: 350 غ"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sugar_free"
                  checked={formData.sugar_free}
                  onChange={(e) => setFormData({ ...formData, sugar_free: e.target.checked })}
                  className="w-5 h-5 text-green-600"
                />
                <label htmlFor="sugar_free" className="text-gray-700 font-semibold text-sm sm:text-base">
                  خالٍ من السكر
                </label>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                {product.sugar_free && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    خالي من السكر
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-2">{product.category}</p>
              <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg sm:text-xl font-bold text-green-700">${product.price}</span>
                <span
                  className={`text-xs sm:text-sm ${
                    product.quantity === 0 ? 'text-red-600 font-semibold' : 'text-gray-600'
                  }`}
                >
                  الكمية: {product.quantity}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition text-xs sm:text-sm"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">لا توجد منتجات حالياً</p>
        </div>
      )}
    </div>
  );
}
