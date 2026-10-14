import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCY } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer monetary values (in kobo) to human-readable currency strings.
 * e.g., 24500000 kobo -> ₦245,000
 */
export function formatPrice(amountInKobo: number, includeDecimals = false): string {
  const mainAmount = amountInKobo / CURRENCY.koboFactor;
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(mainAmount);
}

export function formatDimensions(dimensions?: { width: number; depth: number; height: number; unit: string }): string {
  if (!dimensions) return 'Standard';
  return `${dimensions.width}W × ${dimensions.depth}D × ${dimensions.height}H ${dimensions.unit}`;
}
