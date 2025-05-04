
/**
 * Calculate visit frequency based on last visit date
 * @param lastVisit Last visit date string
 * @returns String describing frequency: Semanal, Mensual, etc.
 */
export const calculateVisitFrequency = (lastVisit: string | null | undefined): string => {
  if (!lastVisit) return 'N/A';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  
  if (isNaN(lastVisitDate.getTime())) {
    return 'N/A';
  }
  
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  if (diffDays <= 180) return 'Semestral';
  return 'Ocasional';
};
