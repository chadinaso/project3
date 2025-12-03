import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { supabase, Product } from '../../lib/supabase';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';

const CATEGORIES = [
  'الكل',
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

type Props = {
  searchTerm?: string;
};

export default function ProductCatalog({ searchTerm }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold whitespace-nowrap transition text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {searchTerm && (
        <div className="mb-4">
          <p className="text-gray-600">
            نتائج البحث عن: <span className="font-bold text-gray-800">"{searchTerm}"</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'لم يتم العثور على منتجات' : 'لا توجد منتجات في هذا التصنيف'}
          </p>
        </div>
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
