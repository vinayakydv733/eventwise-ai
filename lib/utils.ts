import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currency} ${num.toLocaleString()}`;
  }
}

export function formatDate(
  dateInput: string | Date | null | undefined,
  locale: string = 'en-IN',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return 'Date to be decided';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return date.toLocaleDateString(locale, defaultOptions);
}

export function getDaysRemaining(targetDate: string | Date | null | undefined): {
  days: number;
  label: string;
  isPast: boolean;
} {
  if (!targetDate) return { days: 0, label: 'No date set', isPast: false };
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), label: `${Math.abs(diffDays)}d ago`, isPast: true };
  }
  if (diffDays === 0) {
    return { days: 0, label: 'Today!', isPast: false };
  }
  return { days: diffDays, label: `${diffDays} days left`, isPast: false };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 50);
}
