import { ReactNode, useState, useEffect } from 'react';
import { Leaf, ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';
import WelcomeCharacter from './WelcomeCharacter';

type Props = {
  children: ReactNode;
  onSearch: (term: string) => void;
  onCartClick: () => void;
};

export default function CustomerLayout({ children, onSearch, onCartClick }: Props) {
  const { signOut, profile } = useAuth();
  const { itemCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newsMarquee, setNewsMarquee] = useState('');

  useEffect(() => {
    loadNewsMarquee();

    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        loadNewsMarquee();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNewsMarquee = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'news_marquee')
      .maybeSingle();

    if (data) {
      setNewsMarquee(data.value);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {newsMarquee && (
        <div className="bg-green-700 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-lg font-semibold">
            {newsMarquee}
          </div>
        </div>
      )}

      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/jara.jpg"
                alt="جارة القمر"
                className="h-16 w-auto cursor-pointer hover:opacity-80 transition"
                onClick={() => {
                  onSearch('');
                  signOut();
                }}
              />
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </form>

            <WelcomeCharacter />

            <div className="flex items-center gap-3">
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>

                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">مرحباً،</p>
                      <p className="font-semibold text-gray-800">{profile?.full_name}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-right hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
