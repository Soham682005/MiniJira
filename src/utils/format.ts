import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

export function formatDate(value?: string) {
  if (!value) return 'No date';
  return format(parseISO(value), 'MMM d, yyyy');
}

export function relativeTime(value: string) {
  return `${formatDistanceToNow(parseISO(value))} ago`;
}

export function isOverdue(value?: string) {
  return Boolean(value && isPast(parseISO(value)));
}

export function initials(name?: string) {
  if (!name) return 'TF';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
