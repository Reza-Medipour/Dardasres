import { User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = user
    ? [
        { id: 'dashboard', label: 'داشبورد' },
        { id: 'services', label: 'خدمات هوش مصنوعی' },
        { id: 'profile', label: 'پروفایل' },
        { id: 'subscription', label: 'اشتراک' },
      ]
    : [
        { id: 'home', label: 'خانه' },
        { id: 'features', label: 'امکانات' },
        { id: 'pricing', label: 'قیمت‌ها' },
      ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-primary-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-l from-primary-600 to-accent-600 bg-clip-text text-transparent">
              دردسترس
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold transition-colors ${
                  currentPage === item.id
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-4 mr-4 pr-4 border-r border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {profile?.subscription_type === 'premium' ? 'پرمیوم' : 'رایگان'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="خروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
                >
                  ورود
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-5 py-2 bg-gradient-to-l from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl"
                >
                  ثبت نام
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-right px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-right px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-end gap-2"
                >
                  <span>خروج</span>
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
                  >
                    ورود
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-gradient-to-l from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
                  >
                    ثبت نام
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
