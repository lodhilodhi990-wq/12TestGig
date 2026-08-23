export function formatMoney(amountMinor: number, currency: string = 'USD', locale: string = 'en-US'): string {
  // Amount is in minor units (e.g., cents). Convert to major units.
  const amountMajor = amountMinor / 100;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountMajor);
}
