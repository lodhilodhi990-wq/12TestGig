import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PricingRates {
  coinsPerUsd: number;
  pkrPerUsd: number;
  oneCoinUsd: number;
  oneCoinPkr: number;
  minDepositUsd: number;
  minWithdrawCoins: number;
  base20TesterCost: number;
  dailyTesterPayout: number;
  completionBonus: number;
  platformFeePercent: number;
  easypaisaNumber: string;
  easypaisaTitle: string;
  bankDetails: string;
  payoneerEmail: string;
  usdtAddress: string;
}

export const DEFAULT_PRICING_RATES: PricingRates = {
  coinsPerUsd: 100,
  pkrPerUsd: 280,
  oneCoinUsd: 0.01,
  oneCoinPkr: 2.80,
  minDepositUsd: 5,
  minWithdrawCoins: 1000,
  base20TesterCost: 2000,
  dailyTesterPayout: 100,
  completionBonus: 600,
  platformFeePercent: 20,
  easypaisaNumber: '0300-1234567',
  easypaisaTitle: 'Umar Hayat',
  bankDetails: 'Meezan Bank, Acc: 1234567890 (Umar Hayat)',
  payoneerEmail: 'pay@12testgig.com',
  usdtAddress: 'USDT TRC20: T9yD14Nj9yDbv... (Binance Pay)',
};

export async function fetchLivePricingRates(): Promise<PricingRates> {
  try {
    const docRef = doc(db, 'platform_settings', 'pricing_rates');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const merged = { ...DEFAULT_PRICING_RATES, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_pricing_rates', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    console.warn('Failed to fetch pricing rates from firestore, using cache', err);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('admin_pricing_rates');
    if (cached) {
      try {
        return { ...DEFAULT_PRICING_RATES, ...JSON.parse(cached) };
      } catch (e) {
        console.error(e);
      }
    }
  }

  return DEFAULT_PRICING_RATES;
}
