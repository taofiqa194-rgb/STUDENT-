/**
 * Formatting utilities for StudentMate
 */

export function formatNaira(amount: number): string {
  const rounded = Math.round(amount || 0);
  return '₦' + rounded.toLocaleString('en-NG');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string): string {
  return timeString || '';
}
