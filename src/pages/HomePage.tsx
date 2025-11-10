import { Mic, FileText, Video, Image, Subtitles, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const services = [
    {
      icon: FileText,
      title: 'تبدیل گفتار به متن',
      description: 'تبدیل خودکار فایل‌های صوتی و ویدیویی به متن کامل با دقت بالا',
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
    {
      icon: Subtitles,
      title: 'تولید زیرنویس',
      description: 'ساخت زیرنویس دقیق با زمان‌بندی مناسب برای ویدیوها',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
    {
      icon: Sparkles,
      title: 'خلاصه‌سازی هوشمند',
      description: 'تولید خلاصه‌های جامع و مفید از محتوای شما',
      color: 'from-amber-500 to-orange-500',
      image: 'https://images.pexels.com/photos/8438993/pexels-photo-8438993.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
    {
      icon: FileText,
      title: 'تولید عنوان',
      description: 'ساخت عناوین جذاب و حرفه‌ای کوتاه یا بلند',
      color: 'from-emerald-500 to-teal-500',
      image: 'https://images.pexels.com/photos/8438992/pexels-photo-8438992.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
    {
      icon: Image,
      title: 'تولید تصویر',
      description: 'ایجاد تصاویر کارتونی، انیمیشنی و هنری با هوش مصنوعی',
      color: 'from-rose-500 to-red-500',
      image: 'https://images.pexels.com/photos/8438977/pexels-photo-8438977.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
    {
      icon: Video,
      title: 'تولید ویدیو',
      description: 'ساخت ویدیوهای حرفه‌ای با استفاده از هوش مصنوعی',
      color: 'from-violet-500 to-purple-500',
      image: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    },
  ];

  const features = [
    'پشتیبانی از زبان‌های متعدد',
    'پردازش سریع و دقیق',
    'رابط کاربری ساده و کاربرپسند',
    'ذخیره تاریخچه پروژه‌ها',
    'دانلود و کپی آسان نتایج',
    'محدودیت آپلود تا 1 گیگابایت',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary-600 via-primary-700 to-accent-600 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            دردسترس
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            تبدیل صدا و ویدیو به متن، تولید محتوا، زیرنویس، خلاصه‌سازی و بسیاری امکانات دیگر با قدرت هوش مصنوعی
          </p>
          <p className="text-sm md:text-base text-gray-300 mt-3 mb-10">
            ابزار هوش مصنوعی برای تولید و پردازش محتوا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('signup')}
              className="px-10 py-4 bg-white text-primary-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3"
            >
              <span>شروع رایگان</span>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              بیشتر بدانید
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-xl text-gray-600 font-medium">همه چیز که برای تولید محتوا نیاز دارید</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden relative"
                  onClick={() => onNavigate('services')}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">چرا دردسترس؟</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                پلتفرم هوش مصنوعی دردسترس با استفاده از جدیدترین تکنولوژی‌های پردازش زبان طبیعی و تولید محتوا،
                ابزارهای قدرتمندی را برای تبدیل ایده‌های شما به محتوای حرفه‌ای فراهم می‌کند.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-primary-500 to-accent-500 w-3/4"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">در حال پردازش... 75%</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      متن نمونه تبدیل شده از فایل صوتی با دقت بالا و سرعت فوق‌العاده...
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <FileText className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900">متن کامل</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900">خلاصه هوشمند</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold mb-6">آماده شروع هستید؟</h2>
          <p className="text-xl mb-10 text-gray-100 font-medium">
            همین حالا ثبت نام کنید و از خدمات رایگان ما استفاده کنید
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-12 py-5 bg-white text-primary-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3"
          >
            <span>ثبت نام رایگان</span>
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
