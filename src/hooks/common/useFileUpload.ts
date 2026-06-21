/**
 * @file useFileUpload.ts
 * @description Hook for uploading files and returning the public URL.
 * @module hooks/common
 */

import { useState, useCallback } from 'react';

interface UseFileUploadReturn {
  /** Upload a file to the server, returns the public URL */
  upload: (file: File, folder?: string) => Promise<string>;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

/**
 * useFileUpload
 * @description Provides a function to upload a file (e.g. Aadhar PDF) and track
 *   upload progress. Expects a POST /upload endpoint that returns { url }.
 * @returns Upload trigger, loading state, progress (0-100), error message.
 */
export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, _folder = 'documents'): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for progress tracking
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload');

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.data?.url || response.url);
            } catch {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.send(formData);
      });

      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, progress, error };
}
