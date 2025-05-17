
import { format } from 'date-fns';

/**
 * Gets default date range for analytics (last 90 days)
 */
export const getDefaultDateRange = (): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return { startDate, endDate };
};

/**
 * Formats date for consistent usage in analytics
 */
export const formatAnalyticsDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parses date string into Date object
 */
export const parseAnalyticsDate = (dateString: string): Date => {
  return new Date(dateString);
};
