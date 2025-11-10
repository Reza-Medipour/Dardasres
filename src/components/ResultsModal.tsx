import { X, Download, Copy, CheckCircle2, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    summary?: string;
    headline?: string;
    headline_short?: string;
    transcript?: string;
    transcript_short?: string;
    gt_translated?: string;
    gt_translated_short?: string;
    generated_image_url?: string;
    generated_mp4_url?: string;
    generated_video_webm?: string;
  };
}

export function ResultsModal({ isOpen, onClose, results }: ResultsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('کپی کردن با خطا مواجه شد');
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadTextAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">نتایج پردازش</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {results.headline && (
            <div className="bg-gradient-to-l from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-emerald-900">عنوان اصلی</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.headline!, 'headline.txt')}
                    className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.headline!, 'headline')}
                    className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'headline' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-800 text-lg font-medium">{results.headline}</p>
            </div>
          )}

          {results.headline_short && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">عنوان کوتاه</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.headline_short!, 'headline_short.txt')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.headline_short!, 'headline_short')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'headline_short' ? (
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{results.headline_short}</p>
            </div>
          )}

          {results.summary && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-amber-900">خلاصه محتوا</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.summary!, 'summary.txt')}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-amber-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.summary!, 'summary')}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'summary' ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-amber-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{results.summary}</p>
            </div>
          )}

          {results.transcript && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-blue-900">متن کامل</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.transcript!, 'transcript.txt')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.transcript!, 'transcript')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'transcript' ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {results.transcript}
              </p>
            </div>
          )}

          {results.transcript_short && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">متن خلاصه</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.transcript_short!, 'transcript_short.txt')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.transcript_short!, 'transcript_short')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'transcript_short' ? (
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{results.transcript_short}</p>
            </div>
          )}

          {results.gt_translated && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-purple-900">ترجمه کامل</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.gt_translated!, 'translation.txt')}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-purple-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.gt_translated!, 'gt_translated')}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'gt_translated' ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-purple-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {results.gt_translated}
              </p>
            </div>
          )}

          {results.gt_translated_short && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">ترجمه خلاصه</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTextAsFile(results.gt_translated_short!, 'translation_short.txt')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(results.gt_translated_short!, 'gt_translated_short')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="کپی"
                  >
                    {copiedField === 'gt_translated_short' ? (
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{results.gt_translated_short}</p>
            </div>
          )}

          {results.generated_image_url && (
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-rose-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  تصویر تولید شده
                </h3>
                <button
                  onClick={() => downloadFile(results.generated_image_url!, 'generated-image.jpg')}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </button>
              </div>
              <img
                src={results.generated_image_url}
                alt="Generated"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {results.generated_mp4_url && (
            <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-violet-900 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  ویدیو MP4
                </h3>
                <button
                  onClick={() => downloadFile(results.generated_mp4_url!, 'generated-video.mp4')}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </button>
              </div>
              <video
                src={results.generated_mp4_url}
                controls
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}

          {results.generated_video_webm && (
            <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-violet-900 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  ویدیو WebM
                </h3>
                <button
                  onClick={() => downloadFile(results.generated_video_webm!, 'generated-video.webm')}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </button>
              </div>
              <video
                src={results.generated_video_webm}
                controls
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
