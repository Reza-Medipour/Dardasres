import { useEffect, useState } from 'react';
import { Crown, Check, Zap, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

interface SubscriptionPageProps {
  onNavigate: (page: string) => void;
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (plan: SubscriptionPlan) => {
    if (!profile) return;

    setPurchasing(plan.id);
    setMessage(null);

    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + plan.duration_days);

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_type: plan.name === 'Free' ? 'free' : 'premium',
          subscription_expires_at: plan.name === 'Free' ? null : expirationDate.toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setMessage({
        type: 'success',
        text: plan.name === 'Free' ? 'به پلن رایگان بازگشتید' : 'اشتراک شما با موفقیت فعال شد',
      });

      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: 'خطا در فعال‌سازی اشتراک. لطفا دوباره تلاش کنید',
      });
    } finally {
      setPurchasing(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const isPremium = profile?.subscription_type === 'premium';
  const isExpired =
    profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date();

  const currentPlan = isPremium && !isExpired ? 'premium' : 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">پلان‌های اشتراک</h1>
          <p className="text-xl text-gray-600">
            پلن مناسب خود را انتخاب کنید و از تمام امکانات استفاده کنید
          </p>
        </div>

        {isPremium && !isExpired && (
          <div className="mb-8 bg-gradient-to-l from-amber-500 to-yellow-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div>
                  <p className="font-bold text-xl">اشتراک پرمیوم فعال است</p>
                  <p className="text-white/90">
                    تا{' '}
                    {new Intl.DateTimeFormat('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date(profile.subscription_expires_at!))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            />
            <p
              className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">در حال بارگذاری پلان‌ها...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isFree = plan.name === 'Free';
              const isPremiumPlan = !isFree;
              const isCurrentPlan =
                (isFree && currentPlan === 'free') || (isPremiumPlan && currentPlan === 'premium');
              const features = Array.isArray(plan.features) ? plan.features : [];

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                    isPremiumPlan && index === 1
                      ? 'border-emerald-500 transform scale-105 relative'
                      : 'border-gray-200'
                  }`}
                >
                  {isPremiumPlan && index === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-l from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      محبوب‌ترین
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-6">
                      {isPremiumPlan ? (
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name_fa}</h3>
                      <div className="mb-4">
                        {isFree ? (
                          <p className="text-4xl font-bold text-gray-900">رایگان</p>
                        ) : (
                          <>
                            <p className="text-4xl font-bold text-gray-900">
                              {formatPrice(plan.price)}
                              <span className="text-lg text-gray-600 font-normal mr-1">تومان</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {plan.duration_days === 30 ? 'هر ماه' : 'هر سال'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span>حداکثر {plan.max_file_size_mb} MB برای هر فایل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span>سهمیه ماهانه: {formatPrice(plan.monthly_quota_mb)} MB</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        {features.map((feature: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(plan)}
                      disabled={isCurrentPlan || purchasing !== null}
                      className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        isCurrentPlan
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                          : isPremiumPlan
                          ? 'bg-gradient-to-l from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {purchasing === plan.id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>در حال پردازش...</span>
                        </>
                      ) : isCurrentPlan ? (
                        'پلن فعلی شما'
                      ) : isFree ? (
                        'استفاده رایگان'
                      ) : (
                        'خرید اشتراک'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            سوالات متداول
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">آیا می‌توانم پلن خود را تغییر دهم؟</h3>
              <p className="text-gray-600">
                بله، می‌توانید در هر زمان پلن خود را ارتقا یا کاهش دهید.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">روش پرداخت چگونه است؟</h3>
              <p className="text-gray-600">
                در حال حاضر این یک نسخه نمایشی است. در نسخه نهایی پرداخت آنلاین فعال خواهد شد.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">آیا بازپرداخت وجود دارد؟</h3>
              <p className="text-gray-600">
                در صورت عدم رضایت در 7 روز اول می‌توانید درخواست بازپرداخت دهید.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">آیا می‌توانم لغو کنم؟</h3>
              <p className="text-gray-600">
                بله، می‌توانید در هر زمان اشتراک خود را لغو کنید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
