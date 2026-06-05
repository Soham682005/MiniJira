import { initials } from '../../utils/format';

export function Avatar({ name, url, size = 'md' }: { name?: string; url?: string; size?: 'sm' | 'md' | 'lg' }) {
  const className = size === 'sm' ? 'h-7 w-7 text-xs' : size === 'lg' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs';
  if (url) return <img src={url} alt={name ?? 'User'} className={`${className} rounded-full object-cover`} />;
  return (
    <span className={`${className} inline-flex items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700`}>
      {initials(name)}
    </span>
  );
}
