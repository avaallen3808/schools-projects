export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a registration number.
 * Format: REG-YYYY-NNNNN
 */
export const generateRegNumber = (year: number, sequence: number): string => {
  return `REG-${year}-${String(sequence).padStart(5, '0')}`;
};

/**
 * Calculate weighted score for SPMB auto-selection.
 */
export const calculateWeightedScore = (
  raporAvg: number,
  ujianAvg: number,
  raporWeight: number,
  ujianWeight: number,
): number => {
  const total = raporAvg * raporWeight + ujianAvg * ujianWeight;
  return Math.round(total * 100) / 100;
};

/**
 * Format date to Indonesian locale.
 */
export const formatDateID = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
