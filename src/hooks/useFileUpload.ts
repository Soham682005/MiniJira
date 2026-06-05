import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadFile as uploadToCloudinary, type CloudinaryUploadResponse } from '../services/cloudinary';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  function startProgress() {
    setProgress(12);
    timerRef.current = window.setInterval(() => {
      setProgress((current) => (current >= 88 ? current : current + 8));
    }, 180);
  }

  function stopProgress(finalValue: number) {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setProgress(finalValue);
  }

  async function uploadFile(file: File): Promise<CloudinaryUploadResponse | null> {
    setUploading(true);
    setSuccess(false);
    setError(null);
    startProgress();

    try {
      const result = await uploadToCloudinary(file);
      stopProgress(100);
      setSuccess(true);
      toast.success('File uploaded to Cloudinary.');
      return result;
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.';
      stopProgress(0);
      setSuccess(false);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      window.setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 450);
    }
  }

  return {
    uploadFile,
    uploading,
    progress,
    success,
    error,
  };
}
