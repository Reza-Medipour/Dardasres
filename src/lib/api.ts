const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://103.75.196.71:9000';

export interface MediaOutputs {
  summary?: boolean;
  headline?: boolean;
  headline_short?: boolean;
  transcript?: boolean;
  srt_original?: boolean;
  srt_translated?: boolean;
  txt_translated?: boolean;
  generated_image_openai?: boolean;
  generated_image_fal?: boolean;
  generated_video_veo?: boolean;
}

export interface ProcessMediaRequest {
  url: string;
  outputs: MediaOutputs;
}

export interface ProcessMediaResponse {
  summary?: string;
  headline?: string;
  headline_short?: string;
  transcript?: string;
  srt_original?: string;
  srt_translated?: string;
  txt_translated?: string;
  generated_image_openai?: string;
  generated_image_fal?: string;
  generated_video_veo?: string;
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

    xhr.open('POST', `${API_BASE_URL}/process-media/`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(request));
  });
}
