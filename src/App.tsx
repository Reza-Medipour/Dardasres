import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { ServicesPage } from './pages/ServicesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { Loader, Sparkles } from 'lucide-react';

type Page =
  | 'home'
  | 'features'
  | 'pricing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'services'
  | 'profile'
  | 'subscription';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    if (!loading) {
      if (user && (currentPage === 'home' || currentPage === 'login' || currentPage === 'signup')) {
        setCurrentPage('dashboard');
      } else if (!user && ['dashboard', 'services', 'profile', 'subscription'].includes(currentPage)) {
        setCurrentPage('home');
      }
    }
  }, [user, loading]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'features' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'pricing' && <SubscriptionPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <AuthPage mode="login" onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <AuthPage mode="signup" onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && user && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'services' && user && <ServicesPage onNavigate={handleNavigate} />}
      {currentPage === 'profile' && user && <ProfilePage />}
      {currentPage === 'subscription' && user && <SubscriptionPage onNavigate={handleNavigate} />}

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 border-t border-gray-700" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">دردسترس</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                پلتفرم هوش مصنوعی برای تبدیل صدا و ویدیو به متن، تولید محتوا و خدمات هوشمند دیگر
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">لینک‌های مفید</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    خانه
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('services')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    خدمات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('subscription')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    قیمت‌ها
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">پشتیبانی</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@dardastras.ir</li>
                <li className="text-gray-400">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} دردسترس. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
