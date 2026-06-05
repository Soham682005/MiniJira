import { Download, FileArchive, FileText, Paperclip, Trash2, UploadCloud } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { deleteFile } from '../../services/cloudinary';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useFileUpload } from '../../hooks/useFileUpload';
import type { Attachment } from '../../types';

type LocalAttachment = Pick<Attachment, 'task_id' | 'file_name' | 'file_url' | 'public_id' | 'uploaded_by'> & {
  id: string;
  format?: string;
  bytes?: number;
};

const accept = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', '.doc', '.docx', '.zip'].join(',');

function FileTypeIcon({ fileName, url }: { fileName: string; url: string }) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '')) {
    return <img src={url} alt={fileName} className="h-12 w-12 rounded-md object-cover" />;
  }
  if (extension === 'zip') return <FileArchive className="h-6 w-6 text-amber-700" />;
  if (['pdf', 'doc', 'docx'].includes(extension ?? '')) return <FileText className="h-6 w-6 text-rose-700" />;
  return <Paperclip className="h-6 w-6 text-slate-500" />;
}

function formatBytes(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentUploader({
  taskId,
  uploadedBy,
}: {
  taskId: string;
  uploadedBy: string;
}) {
  const { uploadFile, uploading, progress, error } = useFileUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([
    {
      id: 'demo-attachment',
      task_id: taskId,
      file_name: 'Requirements.pdf',
      file_url: '#',
      public_id: 'demo/requirements',
      uploaded_by: uploadedBy,
      format: 'pdf',
      bytes: 184000,
    },
  ]);

  const helperText = useMemo(() => 'PNG, JPG, WEBP, PDF, DOC, DOCX, ZIP up to 10 MB', []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;

      const uploaded = await uploadFile(file);
      if (!uploaded) return;

      const metadata: LocalAttachment = {
        id: crypto.randomUUID(),
        task_id: taskId,
        file_name: file.name,
        file_url: uploaded.url,
        public_id: uploaded.publicId,
        uploaded_by: uploadedBy,
        format: uploaded.format,
        bytes: uploaded.bytes,
      };

      setAttachments((current) => [metadata, ...current]);

      if (isSupabaseConfigured) {
        const { error: saveError } = await api.addAttachment({
          task_id: metadata.task_id,
          file_name: metadata.file_name,
          file_url: metadata.file_url,
          public_id: metadata.public_id,
          uploaded_by: metadata.uploaded_by,
        });

        if (saveError) toast.error('Uploaded file, but Supabase metadata save failed.');
      }
    },
    [taskId, uploadedBy, uploadFile],
  );

  async function handleDelete(attachment: LocalAttachment) {
    await deleteFile(attachment.public_id);
    setAttachments((current) => current.filter((item) => item.id !== attachment.id));
    toast.success('Attachment removed from this task.');
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-slate-200 p-4">
      <label
        className={clsx(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center text-sm transition',
          isDragging ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-stone-50 text-slate-600 hover:border-teal-400 hover:bg-teal-50',
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-emerald-700 shadow-sm">
          <UploadCloud className="h-5 w-5" />
        </span>
        <span className="font-medium text-slate-800">Drop files here or click to upload</span>
        <span className="text-xs text-slate-500">{helperText}</span>
        <input className="hidden" type="file" accept={accept} onChange={(event) => void handleFiles(event.target.files ?? [])} />
      </label>

      {uploading && (
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Uploading to Cloudinary</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-emerald-700 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="space-y-2">
        {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <FileTypeIcon fileName={attachment.file_name} url={attachment.file_url} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{attachment.file_name}</p>
                  <p className="text-xs text-slate-500">{[attachment.format?.toUpperCase(), formatBytes(attachment.bytes)].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <a className="rounded-md p-2 text-slate-500 hover:bg-stone-100 hover:text-slate-900" href={attachment.file_url} download aria-label="Download attachment">
                  <Download className="h-4 w-4" />
                </a>
                <button className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" onClick={() => void handleDelete(attachment)} aria-label="Delete attachment">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
