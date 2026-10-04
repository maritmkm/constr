/**
 * Calculate inclusive calendar days between two dates.
 * Example: Oct 1 to Oct 5 inclusive is 5 days.
 */
export const calculateWorkingDays = (startDateInput: Date | string, endDateInput: Date | string): number => {
  const start = new Date(startDateInput);
  const end = new Date(endDateInput);

  // Set time to start of day in UTC/local to ensure exact calendar day calculation
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = utcEnd - utcStart;
  if (diffMs < 0) return 0;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // inclusive
};
