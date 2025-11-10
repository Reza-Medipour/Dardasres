import { useEffect, useState } from 'react';
import { TrendingUp, FileText, Clock, Zap, Crown, Calendar, X, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    thisMonthServices: 0,
    totalUsageMB: 0,
    completedServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!profile) return;

    try {
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (servicesError) throw servicesError;

      const { count: totalCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: monthCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: completedCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('status', 'completed');

      setRecentServices(services || []);
      setStats({
        totalServices: totalCount || 0,
        thisMonthServices: monthCount || 0,
        totalUsageMB: Number(profile.total_usage_mb),
        completedServices: completedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      transcription: 'تبدیل به متن',
      subtitle: 'زیرنویس',
      summary: 'خلاصه‌سازی',
      title: 'تولید عنوان',
      image: 'تولید تصویر',
      video: 'تولید ویدیو',
    };
    return labels[type] || type;
  };

  const handleCancelProcessing = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'cancelled', progress: 0 })
        .eq('id', serviceId);

      if (error) throw error;

      await fetchDashboardData();
    } catch (err) {
      console.error('Error cancelling service:', err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      await fetchDashboardData();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      pending: { text: 'در انتظار', color: 'bg-yellow-100 text-yellow-700' },
      processing: { text: 'در حال پردازش', color: 'bg-blue-100 text-blue-700' },
      completed: { text: 'تکمیل شده', color: 'bg-green-100 text-green-700' },
      failed: { text: 'ناموفق', color: 'bg-red-100 text-red-700' },
    };
    return labels[status] || { text: status, color: 'bg-gray-100 text-gray-700' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isPremium = profile?.subscription_type === 'premium';
  const isExpired =
    profile?.subscription_expires_at &&
    new Date(profile.subscription_expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            خوش آمدید، {profile?.full_name}
          </h1>
          <p className="text-gray-600">آمار و وضعیت خدمات شما</p>
        </div>

        {isPremium && !isExpired && (
          <div className="mb-6 bg-gradient-to-l from-amber-500 to-yellow-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <div>
                  <p className="font-bold text-lg">اشتراک پرمیوم فعال</p>
                  <p className="text-sm text-white/90">
                    تا{' '}
                    {new Intl.DateTimeFormat('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date(profile.subscription_expires_at!))}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('subscription')}
                className="px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                مدیریت اشتراک
              </button>
            </div>
          </div>
        )}

        {(!isPremium || isExpired) && (
          <div className="mb-6 bg-gradient-to-l from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <p className="font-bold text-lg">ارتقا به پرمیوم</p>
                  <p className="text-sm text-white/90">
                    دسترسی نامحدود به تمام امکانات هوش مصنوعی
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('subscription')}
                className="px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                مشاهده پلان‌ها
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalServices}</p>
            <p className="text-sm text-gray-600">کل درخواست‌ها</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.thisMonthServices}</p>
            <p className="text-sm text-gray-600">این ماه</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalUsageMB.toFixed(0)} MB
            </p>
            <p className="text-sm text-gray-600">حجم استفاده شده</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completedServices}</p>
            <p className="text-sm text-gray-600">تکمیل شده</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">آخرین درخواست‌ها</h2>
            <button
              onClick={() => onNavigate('services')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              مشاهده همه
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">در حال بارگذاری...</p>
            </div>
          ) : recentServices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">هنوز درخواستی ندارید</p>
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-2 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                شروع کنید
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentServices.map((service) => {
                const status = getStatusLabel(service.status);
                return (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('services')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {getServiceTypeLabel(service.service_type)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {service.file_size_mb > 0 && `${service.file_size_mb.toFixed(1)} MB`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>زبان: {service.input_language === 'fa' ? 'فارسی' : 'انگلیسی'}</span>
                      <span>{formatDate(service.created_at)}</span>
                    </div>
                    {service.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>در حال پردازش...</span>
                          <span className="font-medium text-primary-600">{service.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-primary-500 to-accent-500 transition-all duration-300"
                            style={{ width: `${service.progress || 0}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelProcessing(service.id);
                          }}
                          className="mt-2 w-full py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>لغو پردازش</span>
                        </button>
                      </div>
                    )}
                    {(service.status === 'completed' || service.status === 'failed' || service.status === 'cancelled') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(service.id);
                        }}
                        className="mt-3 w-full py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف فایل و خروجی</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
