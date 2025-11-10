import { useState } from 'react';
import { User, Mail, Calendar, Crown, Save, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!profile || !fullName.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setMessage({ type: 'success', text: 'اطلاعات با موفقیت ذخیره شد' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'خطا در ذخیره اطلاعات' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const isPremium = profile?.subscription_type === 'premium';
  const isExpired =
    profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">پروفایل کاربری</h1>
          <p className="text-gray-600">مدیریت اطلاعات حساب کاربری شما</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">اطلاعات شخصی</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ عضویت
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profile ? formatDate(profile.created_at) : ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving || fullName === profile?.full_name}
                  className="w-full py-3 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>ذخیره تغییرات</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">آمار استفاده</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">حجم استفاده شده</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.total_usage_mb.toFixed(0)} MB
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">نوع اشتراک</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isPremium && !isExpired ? 'پرمیوم' : 'رایگان'}
                  </p>
                </div>
              </div>

              {isPremium && !isExpired && profile.subscription_expires_at && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Crown className="w-5 h-5" />
                    <div>
                      <p className="font-medium">اشتراک پرمیوم فعال</p>
                      <p className="text-sm">
                        تا {formatDate(profile.subscription_expires_at)} معتبر است
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{profile?.full_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">وضعیت حساب</span>
                  <span className="text-sm font-medium text-green-600">فعال</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">نوع کاربر</span>
                  <span className="text-sm font-medium text-gray-900">
                    {isPremium && !isExpired ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Crown className="w-4 h-4" />
                        پرمیوم
                      </span>
                    ) : (
                      'رایگان'
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">تاریخ عضویت</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile ? formatDate(profile.created_at) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
