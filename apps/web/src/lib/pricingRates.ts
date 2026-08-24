import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ManualMethodDetail {
  enabled: boolean;
  title: string;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  iban?: string;
  raastId?: string;
  network?: string;
  instructions: string;
  qrCodeUrl?: string;
  minDepositUsd: number;
  badge?: string;
}

export interface ApiGatewayDetail {
  enabled: boolean;
  mode: 'sandbox' | 'live';
  title: string;
  publishableKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  storeId?: string;
  merchantId?: string;
  password?: string;
  integritySalt?: string;
  hashKey?: string;
  accountNum?: string;
  returnUrl?: string;
  securedKey?: string;
  instructions?: string;
  badge?: string;
}

export interface ManualPaymentMethods {
  easypaisa: ManualMethodDetail;
  jazzcash: ManualMethodDetail;
  bankTransfer: ManualMethodDetail;
  usdtCrypto: ManualMethodDetail;
  payoneer: ManualMethodDetail;
  sadapay: ManualMethodDetail;
}

export interface ApiPaymentGateways {
  jazzcash: ApiGatewayDetail;
  easypaisa: ApiGatewayDetail;
  stripe: ApiGatewayDetail;
  paypal: ApiGatewayDetail;
  binancePay: ApiGatewayDetail;
  lemonSqueezy: ApiGatewayDetail;
  payfast: ApiGatewayDetail;
}

export interface WithdrawalMethodDetail {
  enabled: boolean;
  title: string;
  minCoins: number;
  maxCoins: number;
  processingTime: string; // e.g. "1 to 24 Hours", "Instant (15-30 Mins)"
  feePercent: number; // e.g. 0% or 2%
  instructions: string;
  badge?: string;
}

export interface WithdrawalMethodsConfig {
  jazzcash: WithdrawalMethodDetail;
  easypaisa: WithdrawalMethodDetail;
  bankTransfer: WithdrawalMethodDetail;
  usdtCrypto: WithdrawalMethodDetail;
  payoneer: WithdrawalMethodDetail;
  sadapay: WithdrawalMethodDetail;
}

export interface PricingRates {
  coinsPerUsd: number;
  pkrPerUsd: number;
  oneCoinUsd: number;
  oneCoinPkr: number;
  minDepositUsd: number;
  minWithdrawCoins: number;
  maxWithdrawCoins: number;
  withdrawalProcessingTime: string;
  withdrawalFeePercent: number;
  withdrawalDailyLimitCoins: number;
  // Package 1: Google Play Req
  base20TesterCost: number;
  base20Testers: number;
  base20Days: number;
  // Package 2: Quick Audit
  quickCoins: number;
  quickTesters: number;
  quickDays: number;
  quickEnabled: boolean;
  // Package 3: Pro Coverage
  proCoins: number;
  proTesters: number;
  proDays: number;
  proEnabled: boolean;
  // Splits & Accounts
  dailyTesterPayout: number;
  completionBonus: number;
  platformFeePercent: number;
  easypaisaNumber: string;
  easypaisaTitle: string;
  bankDetails: string;
  payoneerEmail: string;
  usdtAddress: string;
  
  // Advance Payment Gateways & Manual Accounts Setup
  manualMethods?: ManualPaymentMethods;
  apiGateways?: ApiPaymentGateways;
  withdrawalMethods?: WithdrawalMethodsConfig;
}

export const DEFAULT_MANUAL_METHODS: ManualPaymentMethods = {
  easypaisa: {
    enabled: true,
    title: 'Easypaisa (Pakistan)',
    accountTitle: 'Umar Hayat',
    accountNumber: '0300-1234567',
    instructions: 'Send PKR to this Easypaisa mobile account and enter Transaction ID (TID) / upload screenshot below.',
    minDepositUsd: 5,
    badge: 'Instant PKR'
  },
  jazzcash: {
    enabled: true,
    title: 'JazzCash (Pakistan)',
    accountTitle: 'Umar Hayat',
    accountNumber: '0301-7654321',
    instructions: 'Send PKR via JazzCash app or mobile account and provide Sender Number & TID.',
    minDepositUsd: 5,
    badge: 'Mobile Wallet'
  },
  bankTransfer: {
    enabled: true,
    title: 'Pakistan Local Bank & Raast (IBAN)',
    bankName: 'Meezan Bank Ltd',
    accountTitle: 'Umar Hayat',
    accountNumber: '01020304050607',
    iban: 'PK64MEZN0000001020304050',
    raastId: '03001234567',
    instructions: 'Direct 1-minute transfer via Raast ID or Bank IBAN. Enter Bank Reference No. below.',
    minDepositUsd: 10,
    badge: 'Direct Raast / IBAN'
  },
  usdtCrypto: {
    enabled: true,
    title: 'USDT TRC20 & Binance Pay',
    network: 'TRC-20 (Tron Network)',
    accountTitle: '12 Test Gig Binance',
    accountNumber: 'T9yD14Nj9yDbvWzV1234567890abcdef',
    raastId: 'Binance Pay ID: 827491039',
    instructions: 'Send USDT (TRC-20) or Binance Pay ID. Provide the Transaction Hash (TxID) after transfer.',
    minDepositUsd: 10,
    badge: 'Crypto Global'
  },
  payoneer: {
    enabled: true,
    title: 'Payoneer / Wise (International USD)',
    accountTitle: '12 Test Gig LLC',
    accountNumber: 'pay@12testgig.com',
    instructions: 'Make in-network transfer via Payoneer to email pay@12testgig.com. No transfer fees.',
    minDepositUsd: 20,
    badge: 'USD Direct'
  },
  sadapay: {
    enabled: false,
    title: 'SadaPay / NayaPay',
    accountTitle: 'Umar Hayat',
    accountNumber: '0300-1234567',
    instructions: 'Send money to SadaPay / NayaPay wallet number and upload confirmation screenshot.',
    minDepositUsd: 5,
    badge: 'Fintech Wallet'
  }
};

export const DEFAULT_API_GATEWAYS: ApiPaymentGateways = {
  jazzcash: {
    enabled: false,
    mode: 'sandbox',
    title: 'JazzCash Merchant API (Auto-Verify)',
    merchantId: '',
    password: '',
    integritySalt: '',
    returnUrl: 'https://12testgig.com/api/webhooks/payment/jazzcash',
    instructions: 'Automated 1-click JazzCash Mobile Wallet / Debit Card checkout with instant automated deposit confirmation.',
    badge: 'Auto-Verify ⚡'
  },
  easypaisa: {
    enabled: false,
    mode: 'sandbox',
    title: 'Easypaisa DirectPay API (Auto-Verify)',
    storeId: '',
    hashKey: '',
    accountNum: '',
    returnUrl: 'https://12testgig.com/api/webhooks/payment/easypaisa',
    instructions: 'Instant Easypaisa Online Gateway with automated OTP & IPN callback coin crediting.',
    badge: 'Auto-Verify ⚡'
  },
  stripe: {
    enabled: false,
    mode: 'sandbox',
    title: 'Stripe (Credit / Debit Card)',
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    instructions: 'Accept Visa, Mastercard, American Express with automated instant coin activation.',
    badge: 'Automated ⚡'
  },
  paypal: {
    enabled: false,
    mode: 'sandbox',
    title: 'PayPal Express Checkout',
    clientId: '',
    clientSecret: '',
    instructions: 'Instant international payment via PayPal balance, bank, or linked credit card.',
    badge: 'Automated ⚡'
  },
  binancePay: {
    enabled: false,
    mode: 'sandbox',
    title: 'Binance Pay Instant API',
    apiKey: '',
    secretKey: '',
    merchantId: '',
    instructions: 'Automated 0-fee crypto checkout with QR code scanning directly in Binance App.',
    badge: 'Instant Crypto ⚡'
  },
  lemonSqueezy: {
    enabled: false,
    mode: 'sandbox',
    title: 'Lemon Squeezy / Paddle',
    apiKey: '',
    storeId: '',
    webhookSecret: '',
    instructions: 'Global Merchant of Record handling worldwide VAT and card processing.',
    badge: 'Automated ⚡'
  },
  payfast: {
    enabled: false,
    mode: 'sandbox',
    title: 'PayFast Online Gateway',
    merchantId: '',
    securedKey: '',
    instructions: 'Instant Pakistani online checkout via Debit Cards, UnionPay, and Wallets.',
    badge: 'Instant PK API ⚡'
  }
};

export const DEFAULT_WITHDRAWAL_METHODS: WithdrawalMethodsConfig = {
  jazzcash: {
    enabled: true,
    title: 'JazzCash (Pakistan)',
    minCoins: 500,
    maxCoins: 50000,
    processingTime: '1 to 24 Hours',
    feePercent: 0,
    instructions: 'Provide active JazzCash 11-digit mobile number and registered account title.',
    badge: 'Fast Mobile Payout'
  },
  easypaisa: {
    enabled: true,
    title: 'Easypaisa (Pakistan)',
    minCoins: 500,
    maxCoins: 50000,
    processingTime: '1 to 24 Hours',
    feePercent: 0,
    instructions: 'Provide active Easypaisa mobile number and registered CNIC account title.',
    badge: 'Instant Mobile Payout'
  },
  bankTransfer: {
    enabled: true,
    title: 'Pakistan Local Bank & Raast (IBAN)',
    minCoins: 1000,
    maxCoins: 100000,
    processingTime: '2 to 24 Hours',
    feePercent: 0,
    instructions: 'Provide Bank Name, 24-digit IBAN (or Raast ID), and Exact Account Title.',
    badge: 'Direct Raast / IBAN'
  },
  usdtCrypto: {
    enabled: true,
    title: 'USDT (TRC-20) / Binance Pay',
    minCoins: 1000,
    maxCoins: 200000,
    processingTime: '1 to 12 Hours',
    feePercent: 1,
    instructions: 'Provide TRC-20 Wallet Address or Binance Pay ID. Fast worldwide crypto payout.',
    badge: 'Global Crypto'
  },
  payoneer: {
    enabled: true,
    title: 'Payoneer (USD Payout)',
    minCoins: 2000,
    maxCoins: 100000,
    processingTime: '12 to 24 Hours',
    feePercent: 0,
    instructions: 'Provide registered Payoneer email address for direct in-network USD payment.',
    badge: 'Direct USD'
  },
  sadapay: {
    enabled: true,
    title: 'SadaPay / NayaPay',
    minCoins: 500,
    maxCoins: 50000,
    processingTime: '1 to 24 Hours',
    feePercent: 0,
    instructions: 'Provide your SadaPay or NayaPay registered mobile number and title.',
    badge: 'Fintech Payout'
  }
};

export const DEFAULT_PRICING_RATES: PricingRates = {
  coinsPerUsd: 100,
  pkrPerUsd: 280,
  oneCoinUsd: 0.01,
  oneCoinPkr: 2.80,
  minDepositUsd: 5,
  minWithdrawCoins: 500,
  maxWithdrawCoins: 50000,
  withdrawalProcessingTime: '1 to 24 Hours',
  withdrawalFeePercent: 0,
  withdrawalDailyLimitCoins: 100000,
  base20TesterCost: 200,
  base20Testers: 20,
  base20Days: 14,
  quickCoins: 100,
  quickTesters: 10,
  quickDays: 7,
  quickEnabled: true,
  proCoins: 350,
  proTesters: 30,
  proDays: 14,
  proEnabled: true,
  dailyTesterPayout: 100,
  completionBonus: 600,
  platformFeePercent: 20,
  easypaisaNumber: '0300-1234567',
  easypaisaTitle: 'Umar Hayat',
  bankDetails: 'Meezan Bank, Acc: 1234567890 (Umar Hayat)',
  payoneerEmail: 'pay@12testgig.com',
  usdtAddress: 'USDT TRC20: T9yD14Nj9yDbv... (Binance Pay)',
  manualMethods: DEFAULT_MANUAL_METHODS,
  apiGateways: DEFAULT_API_GATEWAYS,
  withdrawalMethods: DEFAULT_WITHDRAWAL_METHODS,
};

function normalizePricingRates(data: any): PricingRates {
  const manual = { ...DEFAULT_MANUAL_METHODS, ...(data?.manualMethods || {}) };
  const api = { ...DEFAULT_API_GATEWAYS, ...(data?.apiGateways || {}) };
  const withdraw = { ...DEFAULT_WITHDRAWAL_METHODS, ...(data?.withdrawalMethods || {}) };

  return {
    ...DEFAULT_PRICING_RATES,
    ...data,
    manualMethods: manual,
    apiGateways: api,
    withdrawalMethods: withdraw,
  };
}

export function getCachedPricingRates(): PricingRates {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('admin_pricing_rates');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return normalizePricingRates(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return DEFAULT_PRICING_RATES;
}

export async function fetchLivePricingRates(): Promise<PricingRates> {
  try {
    const docRef = doc(db, 'platform_settings', 'pricing_rates');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const merged = normalizePricingRates(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_pricing_rates', JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    console.warn('Failed to fetch pricing rates from firestore, using cache', err);
  }

  return getCachedPricingRates();
}

export function subscribeToLivePricingRates(callback: (rates: PricingRates) => void) {
  callback(getCachedPricingRates());

  try {
    const docRef = doc(db, 'platform_settings', 'pricing_rates');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const merged = normalizePricingRates(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_pricing_rates', JSON.stringify(merged));
        }
        callback(merged);
      }
    }, (error) => {
      console.warn('Pricing subscription fallback to cache', error);
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Realtime subscription error', e);
    return () => {};
  }
}
