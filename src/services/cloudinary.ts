const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

if (!isCloudinaryConfigured) {
  throw new Error(
    [
      'Cloudinary is not configured.',
      'Missing required Vite environment variables:',
      '- VITE_CLOUDINARY_CLOUD_NAME',
      '- VITE_CLOUDINARY_UPLOAD_PRESET',
      '',
      'Set them in your .env file and restart the dev server.',
    ].join('\n'),
  );
}


export type SupportedFileType = 'image' | 'pdf' | 'doc' | 'zip' | 'unknown';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  originalFilename: string;
  format: string;
  bytes: number;
}

interface CloudinaryRawResponse {
  secure_url: string;
  public_id: string;
  original_filename?: string;
  format?: string;
  bytes?: number;
}

const allowedMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
]);

const allowedExtensions = new Set(['png', 'jpg', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'zip']);

export const maxUploadBytes = 10 * 1024 * 1024;

export function getFileType(file: File): SupportedFileType {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if ((file.type.startsWith('image/') || !file.type) && ['png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '')) return 'image';
  if (file.type === 'application/pdf' || extension === 'pdf') return 'pdf';
  if (
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'doc' ||
    extension === 'docx'
  ) {
    return 'doc';
  }
  if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || extension === 'zip') return 'zip';

  return 'unknown';
}

export function validateFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isAllowedType = allowedMimeTypes.has(file.type) || allowedExtensions.has(extension);

  if (!isAllowedType || getFileType(file) === 'unknown') {
    throw new Error('Unsupported file type. Upload PNG, JPG, WEBP, PDF, DOC, DOCX, or ZIP files.');
  }

  if (file.size > maxUploadBytes) {
    throw new Error('File is too large. Maximum upload size is 10 MB.');
  }
}

export async function uploadFile(file: File): Promise<CloudinaryUploadResponse> {
  validateFile(file);

  if (!cloudName) throw new Error('Cloudinary cloud name is not configured.');
  if (!uploadPreset) throw new Error('Cloudinary unsigned upload preset is not configured.');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || 'Cloudinary upload failed. Please try again.');
  }

  const data = (await response.json()) as CloudinaryRawResponse;

  return {
    url: data.secure_url,
    publicId: data.public_id,
    originalFilename: data.original_filename ?? file.name,
    format: data.format ?? file.name.split('.').pop()?.toLowerCase() ?? '',
    bytes: data.bytes ?? file.size,
  };
}

export async function deleteFile(publicId: string) {
  void publicId;
  return Promise.resolve({
    ok: true,
    message: 'Delete from Cloudinary must be handled by a secure backend in production.',
  });
}
