const API_BASE_URL = 'http://103.75.196.71:9000';

export interface ProcessMediaRequest {
  file?: File;
  url?: string;
  include_summary?: boolean;
  include_transcript?: boolean;
  include_srt?: boolean;
  include_image?: boolean;
  include_video?: boolean;
}

export interface ProcessMediaResponse {
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
}

export interface APIError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export async function processMedia(
  request: ProcessMediaRequest,
  onProgress?: (progress: number) => void
): Promise<ProcessMediaResponse> {
  const formData = new FormData();

  if (request.file) {
    formData.append('file', request.file);
  }

  if (request.url) {
    formData.append('url', request.url);
  }

  if (request.include_summary) {
    formData.append('include_summary', 'true');
  }

  if (request.include_transcript) {
    formData.append('include_transcript', 'true');
  }

  if (request.include_srt) {
    formData.append('include_srt', 'true');
  }

  if (request.include_image) {
    formData.append('include_image', 'true');
  }

  if (request.include_video) {
    formData.append('include_video', 'true');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('خطا در پردازش پاسخ سرور'));
        }
      } else if (xhr.status === 422) {
        try {
          const error: APIError = JSON.parse(xhr.responseText);
          const errorMsg = error.detail.map((e) => e.msg).join(', ');
          reject(new Error(errorMsg || 'داده‌های ورودی نامعتبر است'));
        } catch {
          reject(new Error('داده‌های ورودی نامعتبر است'));
        }
      } else {
        reject(new Error('خطا در ارتباط با سرور'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('خطا در ارتباط با سرور'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('درخواست لغو شد'));
    });

    xhr.open('POST', `${API_BASE_URL}/analyze/`);
    xhr.send(formData);
  });
}
