import { useState, useEffect } from 'react';
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Subtitles,
  Sparkles,
  Image as ImageIcon,
  Video,
  Loader,
  CheckCircle2,
  XCircle,
  Download,
  Copy,
  Clock,
  Languages,
  X,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { processMedia } from '../lib/api';
import { ResultsModal } from '../components/ResultsModal';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceType = 'summary' | 'headline' | 'headline_short' | 'transcript' | 'srt_original' | 'srt_translated' | 'txt_translated' | 'image_openai' | 'image_fal' | 'video_veo';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { profile } = useAuth();
  const [inputType, setInputType] = useState<'file' | 'link'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [language, setLanguage] = useState('fa');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Service[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const serviceOptions = [
    {
      id: 'summary' as ServiceType,
      label: 'خلاصه',
      description: 'خلاصه‌سازی هوشمند محتوا',
      icon: Sparkles,
      color: 'amber',
      apiField: 'summary'
    },
    {
      id: 'headline' as ServiceType,
      label: 'عنوان اصلی',
      description: 'تولید عنوان کامل',
      icon: FileText,
      color: 'emerald',
      apiField: 'headline'
    },
    {
      id: 'headline_short' as ServiceType,
      label: 'عنوان کوتاه',
      description: 'تولید عنوان کوتاه',
      icon: FileText,
      color: 'teal',
      apiField: 'headline_short'
    },
    {
      id: 'transcript' as ServiceType,
      label: 'متن کامل',
      description: 'تبدیل صوت به متن',
      icon: FileText,
      color: 'blue',
      apiField: 'transcript'
    },
    {
      id: 'srt_original' as ServiceType,
      label: 'زیرنویس اصلی',
      description: 'فایل زیرنویس SRT',
      icon: Subtitles,
      color: 'purple',
      apiField: 'srt_original'
    },
    {
      id: 'srt_translated' as ServiceType,
      label: 'زیرنویس ترجمه',
      description: 'زیرنویس ترجمه شده',
      icon: Subtitles,
      color: 'indigo',
      apiField: 'srt_translated'
    },
    {
      id: 'txt_translated' as ServiceType,
      label: 'متن ترجمه',
      description: 'متن ترجمه شده',
      icon: Languages,
      color: 'cyan',
      apiField: 'txt_translated'
    },
    {
      id: 'image_openai' as ServiceType,
      label: 'تصویر OpenAI',
      description: 'تولید تصویر با OpenAI',
      icon: ImageIcon,
      color: 'rose',
      apiField: 'generated_image_openai'
    },
    {
      id: 'image_fal' as ServiceType,
      label: 'تصویر FAL',
      description: 'تولید تصویر با FAL',
      icon: ImageIcon,
      color: 'pink',
      apiField: 'generated_image_fal'
    },
    {
      id: 'video_veo' as ServiceType,
      label: 'ویدیو VEO',
      description: 'تولید ویدیو با VEO',
      icon: Video,
      color: 'violet',
      apiField: 'generated_video_veo'
    },
  ];

  const languages = [
    { code: 'fa', label: 'فارسی' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'fr', label: 'Français' },
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = profile?.subscription_type === 'premium' ? 1024 : 100;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSize) {
      setError(`حجم فایل نباید بیشتر از ${maxSize} مگابایت باشد`);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const toggleService = (serviceId: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 500);
    setProgressInterval(interval);
    return interval;
  };

  const handleCancelUpload = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    setError('آپلود لغو شد');
  };

  const handleCancelProcessing = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'cancelled', progress: 0 })
        .eq('id', serviceId);

      if (error) throw error;

      setProcessingIds((prev) => prev.filter((id) => id !== serviceId));
      await fetchHistory();
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

      await fetchHistory();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;

    if (inputType === 'link' && !linkInput.trim()) {
      setError('لطفا لینک ویدیو را وارد کنید');
      return;
    }

    if (selectedServices.length === 0) {
      setError('لطفا حداقل یک خدمت را انتخاب کنید');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const outputs: any = {};
      selectedServices.forEach((serviceType) => {
        const option = serviceOptions.find((s) => s.id === serviceType);
        if (option?.apiField) {
          outputs[option.apiField] = true;
        }
      });

      const { data: serviceRecord, error: dbError } = await supabase
        .from('services')
        .insert({
          user_id: profile.id,
          service_type: selectedServices[0],
          selected_services: selectedServices,
          selected_outputs: outputs,
          input_type: 'link',
          input_url: linkInput,
          input_language: language,
          file_size_mb: 0,
          status: 'processing',
          progress: 0,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const apiRequest = {
        url: linkInput,
        outputs: outputs,
      };

      const result = await processMedia(apiRequest, (progress) => {
        setUploadProgress(progress);

        supabase
          .from('services')
          .update({ progress: Math.floor(progress) })
          .eq('id', serviceRecord.id)
          .then();
      });

      await supabase
        .from('services')
        .update({
          status: 'completed',
          progress: 100,
          result_data: result,
          completed_at: new Date().toISOString(),
        })
        .eq('id', serviceRecord.id);

      await supabase.from('usage_history').insert({
        user_id: profile.id,
        service_id: serviceRecord.id,
        service_type: selectedServices[0],
        file_size_mb: 0,
        cost_credits: selectedServices.length,
      });

      await fetchHistory();

      setLinkInput('');
      setSelectedServices([]);
      setUploading(false);
      setUploadProgress(0);
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داده است. لطفا دوباره تلاش کنید');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">خدمات هوش مصنوعی</h1>
          <p className="text-gray-600">فایل خود را آپلود کنید و خدمات مورد نظر را انتخاب کنید</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ورودی</h2>

              <div>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  disabled={uploading}
                />
                <p className="text-sm text-gray-600 mt-2">
                  <LinkIcon className="w-4 h-4 inline ml-1" />
                  لینک ویدیو خود را وارد کنید
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Languages className="w-4 h-4 inline ml-1" />
                  زبان محتوا
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  disabled={uploading}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">در حال آپلود...</span>
                    <span className="text-sm font-medium text-primary-600">
                      {uploadProgress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-primary-500 to-accent-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={handleCancelUpload}
                    className="mt-3 w-full py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>لغو آپلود</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">خدمات مورد نظر</h2>
              <p className="text-sm text-gray-600 mb-4">
                خدماتی که می‌خواهید در خروجی دریافت کنید را انتخاب کنید
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {serviceOptions.map((service) => {
                  const Icon = service.icon;
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      disabled={uploading}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon
                        className={`w-8 h-8 mx-auto mb-2 ${
                          isSelected ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      />
                      <p
                        className={`text-sm font-medium mb-1 ${
                          isSelected ? 'text-emerald-900' : 'text-gray-700'
                        }`}
                      >
                        {service.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading || selectedServices.length === 0}
                className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>در حال آپلود...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>شروع پردازش</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">تاریخچه</h2>

              {loadingHistory ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">هنوز تاریخچه‌ای ندارید</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.slice(0, 10).map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {serviceOptions.find((s) => s.id === service.service_type)?.label}
                        </span>
                        {getStatusIcon(service.status)}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {new Date(service.created_at).toLocaleDateString('fa-IR')}
                      </div>
                      {service.status === 'processing' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">در حال پردازش</span>
                            <span className="text-xs font-medium text-primary-600">
                              {service.progress || 0}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-l from-primary-500 to-accent-500 transition-all"
                              style={{ width: `${service.progress || 0}%` }}
                            ></div>
                          </div>
                          <button
                            onClick={() => handleCancelProcessing(service.id)}
                            className="w-full py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 transition-all flex items-center justify-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>لغو پردازش</span>
                          </button>
                        </div>
                      )}
                      {service.status === 'completed' && service.result_data && (
                        <button
                          onClick={() => {
                            setSelectedResult(service.result_data);
                            setShowResultsModal(true);
                          }}
                          className="mt-2 w-full py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded hover:bg-emerald-100 transition-all flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>مشاهده نتایج</span>
                        </button>
                      )}
                      {(service.status === 'completed' || service.status === 'failed' || service.status === 'cancelled') && (
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="mt-2 w-full py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded hover:bg-gray-100 transition-all flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={selectedResult || {}}
      />
    </div>
  );
}
