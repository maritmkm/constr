import { format, parseISO, differenceInCalendarDays, isValid } from 'date-fns';

export function formatDate(dateString?: string | Date): string {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return String(dateString);
    return format(date, 'dd MMM yyyy');
  } catch (e) {
    return String(dateString);
  }
}

export function formatDateForInput(dateString?: string | Date): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
}

export function calculateInclusiveDays(startDateInput: string | Date, endDateInput: string | Date): number {
  if (!startDateInput || !endDateInput) return 0;
  try {
    const start = typeof startDateInput === 'string' ? new Date(startDateInput) : startDateInput;
    const end = typeof endDateInput === 'string' ? new Date(endDateInput) : endDateInput;
    const diff = differenceInCalendarDays(end, start);
    return diff < 0 ? 0 : diff + 1;
  } catch (e) {
    return 0;
  }
}
