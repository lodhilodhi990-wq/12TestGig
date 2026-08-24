import { useState, useEffect } from 'react';
import { 
  Coins, 
  DollarSign, 
  Smartphone, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  Layers, 
  Eye, 
  EyeOff, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'economics' | 'withdrawals' | 'manual' | 'api' | 'rules'>('economics');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getInitialConfig = () => {
    try {
      const saved = localStorage.getItem('admin_pricing_rates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const initial = getInitialConfig();

  // Coin Exchange Rates
  const [coinsPerUsd, setCoinsPerUsd] = useState<number>(initial?.coinsPerUsd ?? 100);
  const [pkrPerUsd, setPkrPerUsd] = useState<number>(initial?.pkrPerUsd ?? 280);
  const [minDepositUsd, setMinDepositUsd] = useState<number>(initial?.minDepositUsd ?? 5);
  const [minWithdrawCoins, setMinWithdrawCoins] = useState<number>(initial?.minWithdrawCoins ?? 500);
  const [maxWithdrawCoins, setMaxWithdrawCoins] = useState<number>(initial?.maxWithdrawCoins ?? 50000);
  const [withdrawalProcessingTime, setWithdrawalProcessingTime] = useState<string>(initial?.withdrawalProcessingTime ?? '1 to 24 Hours');
  const [withdrawalFeePercent, setWithdrawalFeePercent] = useState<number>(initial?.withdrawalFeePercent ?? 0);
  const [withdrawalDailyLimitCoins, setWithdrawalDailyLimitCoins] = useState<number>(initial?.withdrawalDailyLimitCoins ?? 100000);

  // Method by Method Withdrawal Configs
  const [withdrawJcEnabled, setWithdrawJcEnabled] = useState<boolean>(initial?.withdrawalMethods?.jazzcash?.enabled ?? true);
  const [withdrawJcMin, setWithdrawJcMin] = useState<number>(initial?.withdrawalMethods?.jazzcash?.minCoins ?? 500);
  const [withdrawJcMax, setWithdrawJcMax] = useState<number>(initial?.withdrawalMethods?.jazzcash?.maxCoins ?? 50000);
  const [withdrawJcTime, setWithdrawJcTime] = useState<string>(initial?.withdrawalMethods?.jazzcash?.processingTime ?? '1 to 24 Hours');
  const [withdrawJcNote, setWithdrawJcNote] = useState<string>(initial?.withdrawalMethods?.jazzcash?.instructions ?? 'Provide active JazzCash 11-digit mobile number and registered account title.');

  const [withdrawEpEnabled, setWithdrawEpEnabled] = useState<boolean>(initial?.withdrawalMethods?.easypaisa?.enabled ?? true);
  const [withdrawEpMin, setWithdrawEpMin] = useState<number>(initial?.withdrawalMethods?.easypaisa?.minCoins ?? 500);
  const [withdrawEpMax, setWithdrawEpMax] = useState<number>(initial?.withdrawalMethods?.easypaisa?.maxCoins ?? 50000);
  const [withdrawEpTime, setWithdrawEpTime] = useState<string>(initial?.withdrawalMethods?.easypaisa?.processingTime ?? '1 to 24 Hours');
  const [withdrawEpNote, setWithdrawEpNote] = useState<string>(initial?.withdrawalMethods?.easypaisa?.instructions ?? 'Provide active Easypaisa mobile number and registered CNIC account title.');

  const [withdrawBankEnabled, setWithdrawBankEnabled] = useState<boolean>(initial?.withdrawalMethods?.bankTransfer?.enabled ?? true);
  const [withdrawBankMin, setWithdrawBankMin] = useState<number>(initial?.withdrawalMethods?.bankTransfer?.minCoins ?? 1000);
  const [withdrawBankMax, setWithdrawBankMax] = useState<number>(initial?.withdrawalMethods?.bankTransfer?.maxCoins ?? 100000);
  const [withdrawBankTime, setWithdrawBankTime] = useState<string>(initial?.withdrawalMethods?.bankTransfer?.processingTime ?? '2 to 24 Hours');
  const [withdrawBankNote, setWithdrawBankNote] = useState<string>(initial?.withdrawalMethods?.bankTransfer?.instructions ?? 'Provide Bank Name, 24-digit IBAN (or Raast ID), and Exact Account Title.');

  const [withdrawUsdtEnabled, setWithdrawUsdtEnabled] = useState<boolean>(initial?.withdrawalMethods?.usdtCrypto?.enabled ?? true);
  const [withdrawUsdtMin, setWithdrawUsdtMin] = useState<number>(initial?.withdrawalMethods?.usdtCrypto?.minCoins ?? 1000);
  const [withdrawUsdtMax, setWithdrawUsdtMax] = useState<number>(initial?.withdrawalMethods?.usdtCrypto?.maxCoins ?? 200000);
  const [withdrawUsdtTime, setWithdrawUsdtTime] = useState<string>(initial?.withdrawalMethods?.usdtCrypto?.processingTime ?? '1 to 12 Hours');
  const [withdrawUsdtNote, setWithdrawUsdtNote] = useState<string>(initial?.withdrawalMethods?.usdtCrypto?.instructions ?? 'Provide TRC-20 Wallet Address or Binance Pay ID. Fast worldwide crypto payout.');

  const [withdrawPayoEnabled, setWithdrawPayoEnabled] = useState<boolean>(initial?.withdrawalMethods?.payoneer?.enabled ?? true);
  const [withdrawPayoMin, setWithdrawPayoMin] = useState<number>(initial?.withdrawalMethods?.payoneer?.minCoins ?? 2000);
  const [withdrawPayoMax, setWithdrawPayoMax] = useState<number>(initial?.withdrawalMethods?.payoneer?.maxCoins ?? 100000);
  const [withdrawPayoTime, setWithdrawPayoTime] = useState<string>(initial?.withdrawalMethods?.payoneer?.processingTime ?? '12 to 24 Hours');
  const [withdrawPayoNote, setWithdrawPayoNote] = useState<string>(initial?.withdrawalMethods?.payoneer?.instructions ?? 'Provide registered Payoneer email address for direct in-network USD payment.');

  const [withdrawSadaEnabled, setWithdrawSadaEnabled] = useState<boolean>(initial?.withdrawalMethods?.sadapay?.enabled ?? true);
  const [withdrawSadaMin, setWithdrawSadaMin] = useState<number>(initial?.withdrawalMethods?.sadapay?.minCoins ?? 500);
  const [withdrawSadaMax, setWithdrawSadaMax] = useState<number>(initial?.withdrawalMethods?.sadapay?.maxCoins ?? 50000);
  const [withdrawSadaTime, setWithdrawSadaTime] = useState<string>(initial?.withdrawalMethods?.sadapay?.processingTime ?? '1 to 24 Hours');
  const [withdrawSadaNote, setWithdrawSadaNote] = useState<string>(initial?.withdrawalMethods?.sadapay?.instructions ?? 'Provide your SadaPay or NayaPay registered mobile number and title.');

  // Package 1: Google Play Req
  const [base20TesterCost, setBase20TesterCost] = useState<number>(initial?.base20TesterCost ?? 200);
  const [base20Testers, setBase20Testers] = useState<number>(initial?.base20Testers ?? 20);
  const [base20Days, setBase20Days] = useState<number>(initial?.base20Days ?? 14);

  // Package 2: Quick Audit
  const [quickCoins, setQuickCoins] = useState<number>(initial?.quickCoins ?? 100);
  const [quickTesters, setQuickTesters] = useState<number>(initial?.quickTesters ?? 10);
  const [quickDays, setQuickDays] = useState<number>(initial?.quickDays ?? 7);
  const [quickEnabled, setQuickEnabled] = useState<boolean>(initial?.quickEnabled ?? true);

  // Package 3: Pro Coverage
  const [proCoins, setProCoins] = useState<number>(initial?.proCoins ?? 350);
  const [proTesters, setProTesters] = useState<number>(initial?.proTesters ?? 30);
  const [proDays, setProDays] = useState<number>(initial?.proDays ?? 14);
  const [proEnabled, setProEnabled] = useState<boolean>(initial?.proEnabled ?? true);

  // Payout Splits & Profit
  const [dailyTesterPayout, setDailyTesterPayout] = useState<number>(initial?.dailyTesterPayout ?? 100);
  const [completionBonus, setCompletionBonus] = useState<number>(initial?.completionBonus ?? 600);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(initial?.platformFeePercent ?? 20);

  // MANUAL PAYMENT METHODS
  const [easypaisaEnabled, setEasypaisaEnabled] = useState<boolean>(initial?.manualMethods?.easypaisa?.enabled ?? true);
  const [easypaisaTitle, setEasypaisaTitle] = useState<string>(initial?.manualMethods?.easypaisa?.accountTitle ?? initial?.easypaisaTitle ?? 'Umar Hayat');
  const [easypaisaNumber, setEasypaisaNumber] = useState<string>(initial?.manualMethods?.easypaisa?.accountNumber ?? initial?.easypaisaNumber ?? '0300-1234567');
  const [easypaisaNote, setEasypaisaNote] = useState<string>(initial?.manualMethods?.easypaisa?.instructions ?? 'Send PKR to this Easypaisa mobile account and enter Transaction ID (TID).');
  const [easypaisaMinUsd, setEasypaisaMinUsd] = useState<number>(initial?.manualMethods?.easypaisa?.minDepositUsd ?? 5);

  const [jazzcashEnabled, setJazzcashEnabled] = useState<boolean>(initial?.manualMethods?.jazzcash?.enabled ?? true);
  const [jazzcashTitle, setJazzcashTitle] = useState<string>(initial?.manualMethods?.jazzcash?.accountTitle ?? 'Umar Hayat');
  const [jazzcashNumber, setJazzcashNumber] = useState<string>(initial?.manualMethods?.jazzcash?.accountNumber ?? '0301-7654321');
  const [jazzcashNote, setJazzcashNote] = useState<string>(initial?.manualMethods?.jazzcash?.instructions ?? 'Send PKR via JazzCash app or mobile account and provide Sender Number & TID.');
  const [jazzcashMinUsd, setJazzcashMinUsd] = useState<number>(initial?.manualMethods?.jazzcash?.minDepositUsd ?? 5);

  const [bankEnabled, setBankEnabled] = useState<boolean>(initial?.manualMethods?.bankTransfer?.enabled ?? true);
  const [bankName, setBankName] = useState<string>(initial?.manualMethods?.bankTransfer?.bankName ?? 'Meezan Bank Ltd');
  const [bankTitle, setBankTitle] = useState<string>(initial?.manualMethods?.bankTransfer?.accountTitle ?? 'Umar Hayat');
  const [bankAccountNo, setBankAccountNo] = useState<string>(initial?.manualMethods?.bankTransfer?.accountNumber ?? '01020304050607');
  const [bankIban, setBankIban] = useState<string>(initial?.manualMethods?.bankTransfer?.iban ?? 'PK64MEZN0000001020304050');
  const [bankRaastId, setBankRaastId] = useState<string>(initial?.manualMethods?.bankTransfer?.raastId ?? '03001234567');
  const [bankNote, setBankNote] = useState<string>(initial?.manualMethods?.bankTransfer?.instructions ?? 'Direct 1-minute transfer via Raast ID or Bank IBAN. Enter Bank Reference No. below.');
  const [bankMinUsd, setBankMinUsd] = useState<number>(initial?.manualMethods?.bankTransfer?.minDepositUsd ?? 10);

  const [usdtEnabled, setUsdtEnabled] = useState<boolean>(initial?.manualMethods?.usdtCrypto?.enabled ?? true);
  const [usdtNetwork, setUsdtNetwork] = useState<string>(initial?.manualMethods?.usdtCrypto?.network ?? 'USDT TRC-20 (Tron)');
  const [usdtAddress, setUsdtAddress] = useState<string>(initial?.manualMethods?.usdtCrypto?.accountNumber ?? initial?.usdtAddress ?? 'T9yD14Nj9yDbvWzV1234567890abcdef');
  const [binancePayId, setBinancePayId] = useState<string>(initial?.manualMethods?.usdtCrypto?.raastId ?? '827491039');
  const [usdtNote, setUsdtNote] = useState<string>(initial?.manualMethods?.usdtCrypto?.instructions ?? 'Send USDT (TRC-20) or Binance Pay ID. Provide the Transaction Hash (TxID).');
  const [usdtMinUsd, setUsdtMinUsd] = useState<number>(initial?.manualMethods?.usdtCrypto?.minDepositUsd ?? 10);

  const [payoneerEnabled, setPayoneerEnabled] = useState<boolean>(initial?.manualMethods?.payoneer?.enabled ?? true);
  const [payoneerTitle, setPayoneerTitle] = useState<string>(initial?.manualMethods?.payoneer?.accountTitle ?? '12 Test Gig LLC');
  const [payoneerEmail, setPayoneerEmail] = useState<string>(initial?.manualMethods?.payoneer?.accountNumber ?? initial?.payoneerEmail ?? 'pay@12testgig.com');
  const [payoneerNote, setPayoneerNote] = useState<string>(initial?.manualMethods?.payoneer?.instructions ?? 'Make in-network transfer via Payoneer to email pay@12testgig.com.');
  const [payoneerMinUsd, setPayoneerMinUsd] = useState<number>(initial?.manualMethods?.payoneer?.minDepositUsd ?? 20);

  const [sadapayEnabled, setSadapayEnabled] = useState<boolean>(initial?.manualMethods?.sadapay?.enabled ?? false);
  const [sadapayTitle, setSadapayTitle] = useState<string>(initial?.manualMethods?.sadapay?.accountTitle ?? 'Umar Hayat');
  const [sadapayNumber, setSadapayNumber] = useState<string>(initial?.manualMethods?.sadapay?.accountNumber ?? '0300-1234567');
  const [sadapayNote, setSadapayNote] = useState<string>(initial?.manualMethods?.sadapay?.instructions ?? 'Send money to SadaPay / NayaPay wallet number and upload screenshot.');
  const [sadapayMinUsd, setSadapayMinUsd] = useState<number>(initial?.manualMethods?.sadapay?.minDepositUsd ?? 5);

  // AUTOMATED API GATEWAYS
  // 1. JazzCash API
  const [jcApiEnabled, setJcApiEnabled] = useState<boolean>(initial?.apiGateways?.jazzcash?.enabled ?? false);
  const [jcApiMode, setJcApiMode] = useState<'sandbox' | 'live'>(initial?.apiGateways?.jazzcash?.mode ?? 'sandbox');
  const [jcMerchantId, setJcMerchantId] = useState<string>(initial?.apiGateways?.jazzcash?.merchantId ?? '');
  const [jcPassword, setJcPassword] = useState<string>(initial?.apiGateways?.jazzcash?.password ?? '');
  const [jcIntegritySalt, setJcIntegritySalt] = useState<string>(initial?.apiGateways?.jazzcash?.integritySalt ?? '');
  const [showJcSalt, setShowJcSalt] = useState(false);

  // 2. Easypaisa API
  const [epApiEnabled, setEpApiEnabled] = useState<boolean>(initial?.apiGateways?.easypaisa?.enabled ?? false);
  const [epApiMode, setEpApiMode] = useState<'sandbox' | 'live'>(initial?.apiGateways?.easypaisa?.mode ?? 'sandbox');
  const [epStoreId, setEpStoreId] = useState<string>(initial?.apiGateways?.easypaisa?.storeId ?? '');
  const [epHashKey, setEpHashKey] = useState<string>(initial?.apiGateways?.easypaisa?.hashKey ?? '');
  const [epAccountNum, setEpAccountNum] = useState<string>(initial?.apiGateways?.easypaisa?.accountNum ?? '');
  const [showEpHash, setShowEpHash] = useState(false);

  // 3. Stripe
  const [stripeEnabled, setStripeEnabled] = useState<boolean>(initial?.apiGateways?.stripe?.enabled ?? false);
  const [stripeMode, setStripeMode] = useState<'sandbox' | 'live'>(initial?.apiGateways?.stripe?.mode ?? 'sandbox');
  const [stripePublishableKey, setStripePublishableKey] = useState<string>(initial?.apiGateways?.stripe?.publishableKey ?? '');
  const [stripeSecretKey, setStripeSecretKey] = useState<string>(initial?.apiGateways?.stripe?.secretKey ?? '');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState<string>(initial?.apiGateways?.stripe?.webhookSecret ?? '');
  const [showStripeSecret, setShowStripeSecret] = useState(false);

  // 4. Binance Pay
  const [binancePayEnabled, setBinancePayEnabled] = useState<boolean>(initial?.apiGateways?.binancePay?.enabled ?? false);
  const [binancePayMode, setBinancePayMode] = useState<'sandbox' | 'live'>(initial?.apiGateways?.binancePay?.mode ?? 'sandbox');
  const [binancePayApiKey, setBinancePayApiKey] = useState<string>(initial?.apiGateways?.binancePay?.apiKey ?? '');
  const [binancePaySecretKey, setBinancePaySecretKey] = useState<string>(initial?.apiGateways?.binancePay?.secretKey ?? '');
  const [binancePayMerchantId, setBinancePayMerchantId] = useState<string>(initial?.apiGateways?.binancePay?.merchantId ?? '');
  const [showBinanceSecret, setShowBinanceSecret] = useState(false);

  // Simulator State
  const [simTesters, setSimTesters] = useState<number>(20);
  const [simDays, setSimDays] = useState<number>(14);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testApiSuccess, setTestApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const cached = localStorage.getItem('admin_pricing_rates');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          applyConfig(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      try {
        const docRef = doc(db, 'platform_settings', 'pricing_rates');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const d = snap.data();
          applyConfig(d);
          localStorage.setItem('admin_pricing_rates', JSON.stringify(d));
        }
      } catch (err) {
        console.warn('Firestore load', err);
      }
    };

    const applyConfig = (d: any) => {
      if (d.coinsPerUsd !== undefined) setCoinsPerUsd(Number(d.coinsPerUsd));
      if (d.pkrPerUsd !== undefined) setPkrPerUsd(Number(d.pkrPerUsd));
      if (d.minDepositUsd !== undefined) setMinDepositUsd(Number(d.minDepositUsd));
      if (d.minWithdrawCoins !== undefined) setMinWithdrawCoins(Number(d.minWithdrawCoins));
      if (d.maxWithdrawCoins !== undefined) setMaxWithdrawCoins(Number(d.maxWithdrawCoins));
      if (d.withdrawalProcessingTime !== undefined) setWithdrawalProcessingTime(String(d.withdrawalProcessingTime));
      if (d.withdrawalFeePercent !== undefined) setWithdrawalFeePercent(Number(d.withdrawalFeePercent));
      if (d.withdrawalDailyLimitCoins !== undefined) setWithdrawalDailyLimitCoins(Number(d.withdrawalDailyLimitCoins));

      // Withdrawal Methods
      const w = d.withdrawalMethods || {};
      if (w.jazzcash) {
        setWithdrawJcEnabled(Boolean(w.jazzcash.enabled));
        if (w.jazzcash.minCoins !== undefined) setWithdrawJcMin(Number(w.jazzcash.minCoins));
        if (w.jazzcash.maxCoins !== undefined) setWithdrawJcMax(Number(w.jazzcash.maxCoins));
        if (w.jazzcash.processingTime) setWithdrawJcTime(String(w.jazzcash.processingTime));
        if (w.jazzcash.instructions) setWithdrawJcNote(String(w.jazzcash.instructions));
      }
      if (w.easypaisa) {
        setWithdrawEpEnabled(Boolean(w.easypaisa.enabled));
        if (w.easypaisa.minCoins !== undefined) setWithdrawEpMin(Number(w.easypaisa.minCoins));
        if (w.easypaisa.maxCoins !== undefined) setWithdrawEpMax(Number(w.easypaisa.maxCoins));
        if (w.easypaisa.processingTime) setWithdrawEpTime(String(w.easypaisa.processingTime));
        if (w.easypaisa.instructions) setWithdrawEpNote(String(w.easypaisa.instructions));
      }
      if (w.bankTransfer) {
        setWithdrawBankEnabled(Boolean(w.bankTransfer.enabled));
        if (w.bankTransfer.minCoins !== undefined) setWithdrawBankMin(Number(w.bankTransfer.minCoins));
        if (w.bankTransfer.maxCoins !== undefined) setWithdrawBankMax(Number(w.bankTransfer.maxCoins));
        if (w.bankTransfer.processingTime) setWithdrawBankTime(String(w.bankTransfer.processingTime));
        if (w.bankTransfer.instructions) setWithdrawBankNote(String(w.bankTransfer.instructions));
      }
      if (w.usdtCrypto) {
        setWithdrawUsdtEnabled(Boolean(w.usdtCrypto.enabled));
        if (w.usdtCrypto.minCoins !== undefined) setWithdrawUsdtMin(Number(w.usdtCrypto.minCoins));
        if (w.usdtCrypto.maxCoins !== undefined) setWithdrawUsdtMax(Number(w.usdtCrypto.maxCoins));
        if (w.usdtCrypto.processingTime) setWithdrawUsdtTime(String(w.usdtCrypto.processingTime));
        if (w.usdtCrypto.instructions) setWithdrawUsdtNote(String(w.usdtCrypto.instructions));
      }
      if (w.payoneer) {
        setWithdrawPayoEnabled(Boolean(w.payoneer.enabled));
        if (w.payoneer.minCoins !== undefined) setWithdrawPayoMin(Number(w.payoneer.minCoins));
        if (w.payoneer.maxCoins !== undefined) setWithdrawPayoMax(Number(w.payoneer.maxCoins));
        if (w.payoneer.processingTime) setWithdrawPayoTime(String(w.payoneer.processingTime));
        if (w.payoneer.instructions) setWithdrawPayoNote(String(w.payoneer.instructions));
      }
      if (w.sadapay) {
        setWithdrawSadaEnabled(Boolean(w.sadapay.enabled));
        if (w.sadapay.minCoins !== undefined) setWithdrawSadaMin(Number(w.sadapay.minCoins));
        if (w.sadapay.maxCoins !== undefined) setWithdrawSadaMax(Number(w.sadapay.maxCoins));
        if (w.sadapay.processingTime) setWithdrawSadaTime(String(w.sadapay.processingTime));
        if (w.sadapay.instructions) setWithdrawSadaNote(String(w.sadapay.instructions));
      }
      
      if (d.base20TesterCost !== undefined) setBase20TesterCost(Number(d.base20TesterCost));
      if (d.base20Testers !== undefined) setBase20Testers(Number(d.base20Testers));
      if (d.base20Days !== undefined) setBase20Days(Number(d.base20Days));

      if (d.quickCoins !== undefined) setQuickCoins(Number(d.quickCoins));
      if (d.quickTesters !== undefined) setQuickTesters(Number(d.quickTesters));
      if (d.quickDays !== undefined) setQuickDays(Number(d.quickDays));
      if (d.quickEnabled !== undefined) setQuickEnabled(Boolean(d.quickEnabled));

      if (d.proCoins !== undefined) setProCoins(Number(d.proCoins));
      if (d.proTesters !== undefined) setProTesters(Number(d.proTesters));
      if (d.proDays !== undefined) setProDays(Number(d.proDays));
      if (d.proEnabled !== undefined) setProEnabled(Boolean(d.proEnabled));

      if (d.dailyTesterPayout !== undefined) setDailyTesterPayout(Number(d.dailyTesterPayout));
      if (d.completionBonus !== undefined) setCompletionBonus(Number(d.completionBonus));
      if (d.platformFeePercent !== undefined) setPlatformFeePercent(Number(d.platformFeePercent));

      // Manual Methods
      const m = d.manualMethods || {};
      if (m.easypaisa) {
        setEasypaisaEnabled(Boolean(m.easypaisa.enabled));
        if (m.easypaisa.accountTitle) setEasypaisaTitle(m.easypaisa.accountTitle);
        if (m.easypaisa.accountNumber) setEasypaisaNumber(m.easypaisa.accountNumber);
        if (m.easypaisa.instructions) setEasypaisaNote(m.easypaisa.instructions);
        if (m.easypaisa.minDepositUsd) setEasypaisaMinUsd(Number(m.easypaisa.minDepositUsd));
      } else if (d.easypaisaNumber) {
        setEasypaisaNumber(String(d.easypaisaNumber));
        if (d.easypaisaTitle) setEasypaisaTitle(String(d.easypaisaTitle));
      }

      if (m.jazzcash) {
        setJazzcashEnabled(Boolean(m.jazzcash.enabled));
        if (m.jazzcash.accountTitle) setJazzcashTitle(m.jazzcash.accountTitle);
        if (m.jazzcash.accountNumber) setJazzcashNumber(m.jazzcash.accountNumber);
        if (m.jazzcash.instructions) setJazzcashNote(m.jazzcash.instructions);
        if (m.jazzcash.minDepositUsd) setJazzcashMinUsd(Number(m.jazzcash.minDepositUsd));
      }

      if (m.bankTransfer) {
        setBankEnabled(Boolean(m.bankTransfer.enabled));
        if (m.bankTransfer.bankName) setBankName(m.bankTransfer.bankName);
        if (m.bankTransfer.accountTitle) setBankTitle(m.bankTransfer.accountTitle);
        if (m.bankTransfer.accountNumber) setBankAccountNo(m.bankTransfer.accountNumber);
        if (m.bankTransfer.iban) setBankIban(m.bankTransfer.iban);
        if (m.bankTransfer.raastId) setBankRaastId(m.bankTransfer.raastId);
        if (m.bankTransfer.instructions) setBankNote(m.bankTransfer.instructions);
        if (m.bankTransfer.minDepositUsd) setBankMinUsd(Number(m.bankTransfer.minDepositUsd));
      } else if (d.bankDetails) {
        setBankNote(String(d.bankDetails));
      }

      if (m.usdtCrypto) {
        setUsdtEnabled(Boolean(m.usdtCrypto.enabled));
        if (m.usdtCrypto.network) setUsdtNetwork(m.usdtCrypto.network);
        if (m.usdtCrypto.accountNumber) setUsdtAddress(m.usdtCrypto.accountNumber);
        if (m.usdtCrypto.raastId) setBinancePayId(m.usdtCrypto.raastId);
        if (m.usdtCrypto.instructions) setUsdtNote(m.usdtCrypto.instructions);
        if (m.usdtCrypto.minDepositUsd) setUsdtMinUsd(Number(m.usdtCrypto.minDepositUsd));
      } else if (d.usdtAddress) {
        setUsdtAddress(String(d.usdtAddress));
      }

      if (m.payoneer) {
        setPayoneerEnabled(Boolean(m.payoneer.enabled));
        if (m.payoneer.accountTitle) setPayoneerTitle(m.payoneer.accountTitle);
        if (m.payoneer.accountNumber) setPayoneerEmail(m.payoneer.accountNumber);
        if (m.payoneer.instructions) setPayoneerNote(m.payoneer.instructions);
        if (m.payoneer.minDepositUsd) setPayoneerMinUsd(Number(m.payoneer.minDepositUsd));
      } else if (d.payoneerEmail) {
        setPayoneerEmail(String(d.payoneerEmail));
      }

      if (m.sadapay) {
        setSadapayEnabled(Boolean(m.sadapay.enabled));
        if (m.sadapay.accountTitle) setSadapayTitle(m.sadapay.accountTitle);
        if (m.sadapay.accountNumber) setSadapayNumber(m.sadapay.accountNumber);
        if (m.sadapay.instructions) setSadapayNote(m.sadapay.instructions);
        if (m.sadapay.minDepositUsd) setSadapayMinUsd(Number(m.sadapay.minDepositUsd));
      }

      // API Gateways
      const g = d.apiGateways || {};
      if (g.jazzcash) {
        setJcApiEnabled(Boolean(g.jazzcash.enabled));
        if (g.jazzcash.mode) setJcApiMode(g.jazzcash.mode);
        if (g.jazzcash.merchantId) setJcMerchantId(g.jazzcash.merchantId);
        if (g.jazzcash.password) setJcPassword(g.jazzcash.password);
        if (g.jazzcash.integritySalt) setJcIntegritySalt(g.jazzcash.integritySalt);
      }

      if (g.easypaisa) {
        setEpApiEnabled(Boolean(g.easypaisa.enabled));
        if (g.easypaisa.mode) setEpApiMode(g.easypaisa.mode);
        if (g.easypaisa.storeId) setEpStoreId(g.easypaisa.storeId);
        if (g.easypaisa.hashKey) setEpHashKey(g.easypaisa.hashKey);
        if (g.easypaisa.accountNum) setEpAccountNum(g.easypaisa.accountNum);
      }

      if (g.stripe) {
        setStripeEnabled(Boolean(g.stripe.enabled));
        if (g.stripe.mode) setStripeMode(g.stripe.mode);
        if (g.stripe.publishableKey) setStripePublishableKey(g.stripe.publishableKey);
        if (g.stripe.secretKey) setStripeSecretKey(g.stripe.secretKey);
        if (g.stripe.webhookSecret) setStripeWebhookSecret(g.stripe.webhookSecret);
      }

      if (g.binancePay) {
        setBinancePayEnabled(Boolean(g.binancePay.enabled));
        if (g.binancePay.mode) setBinancePayMode(g.binancePay.mode);
        if (g.binancePay.apiKey) setBinancePayApiKey(g.binancePay.apiKey);
        if (g.binancePay.secretKey) setBinancePaySecretKey(g.binancePay.secretKey);
        if (g.binancePay.merchantId) setBinancePayMerchantId(g.binancePay.merchantId);
      }
    };

    loadConfig();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestGateway = (name: string) => {
    setTestApiSuccess(name);
    setTimeout(() => setTestApiSuccess(null), 3000);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const manualMethods = {
      easypaisa: {
        enabled: Boolean(easypaisaEnabled),
        title: 'Easypaisa (Pakistan)',
        accountTitle: String(easypaisaTitle),
        accountNumber: String(easypaisaNumber),
        instructions: String(easypaisaNote),
        minDepositUsd: Number(easypaisaMinUsd),
        badge: 'Instant PKR'
      },
      jazzcash: {
        enabled: Boolean(jazzcashEnabled),
        title: 'JazzCash (Pakistan)',
        accountTitle: String(jazzcashTitle),
        accountNumber: String(jazzcashNumber),
        instructions: String(jazzcashNote),
        minDepositUsd: Number(jazzcashMinUsd),
        badge: 'Mobile Wallet'
      },
      bankTransfer: {
        enabled: Boolean(bankEnabled),
        title: 'Pakistan Local Bank & Raast (IBAN)',
        bankName: String(bankName),
        accountTitle: String(bankTitle),
        accountNumber: String(bankAccountNo),
        iban: String(bankIban),
        raastId: String(bankRaastId),
        instructions: String(bankNote),
        minDepositUsd: Number(bankMinUsd),
        badge: 'Direct Raast / IBAN'
      },
      usdtCrypto: {
        enabled: Boolean(usdtEnabled),
        title: 'USDT TRC20 & Binance Pay',
        network: String(usdtNetwork),
        accountTitle: '12 Test Gig Binance',
        accountNumber: String(usdtAddress),
        raastId: String(binancePayId),
        instructions: String(usdtNote),
        minDepositUsd: Number(usdtMinUsd),
        badge: 'Crypto Global'
      },
      payoneer: {
        enabled: Boolean(payoneerEnabled),
        title: 'Payoneer / Wise (International USD)',
        accountTitle: String(payoneerTitle),
        accountNumber: String(payoneerEmail),
        instructions: String(payoneerNote),
        minDepositUsd: Number(payoneerMinUsd),
        badge: 'USD Direct'
      },
      sadapay: {
        enabled: Boolean(sadapayEnabled),
        title: 'SadaPay / NayaPay',
        accountTitle: String(sadapayTitle),
        accountNumber: String(sadapayNumber),
        instructions: String(sadapayNote),
        minDepositUsd: Number(sadapayMinUsd),
        badge: 'Fintech Wallet'
      }
    };

    const apiGateways = {
      jazzcash: {
        enabled: Boolean(jcApiEnabled),
        mode: jcApiMode,
        title: 'JazzCash Merchant API (Auto-Verify)',
        merchantId: String(jcMerchantId),
        password: String(jcPassword),
        integritySalt: String(jcIntegritySalt),
        returnUrl: 'https://12testgig.com/api/webhooks/payment/jazzcash',
        instructions: 'Automated 1-click JazzCash Mobile Wallet / Card checkout with instant automated deposit confirmation.',
        badge: 'Auto-Verify ⚡'
      },
      easypaisa: {
        enabled: Boolean(epApiEnabled),
        mode: epApiMode,
        title: 'Easypaisa DirectPay API (Auto-Verify)',
        storeId: String(epStoreId),
        hashKey: String(epHashKey),
        accountNum: String(epAccountNum),
        returnUrl: 'https://12testgig.com/api/webhooks/payment/easypaisa',
        instructions: 'Instant Easypaisa Online Gateway with automated OTP & IPN callback coin crediting.',
        badge: 'Auto-Verify ⚡'
      },
      stripe: {
        enabled: Boolean(stripeEnabled),
        mode: stripeMode,
        title: 'Stripe (Credit / Debit Card)',
        publishableKey: String(stripePublishableKey),
        secretKey: String(stripeSecretKey),
        webhookSecret: String(stripeWebhookSecret),
        instructions: 'Accept Visa, Mastercard, American Express with automated instant coin activation.',
        badge: 'Automated ⚡'
      },
      binancePay: {
        enabled: Boolean(binancePayEnabled),
        mode: binancePayMode,
        title: 'Binance Pay Instant API',
        apiKey: String(binancePayApiKey),
        secretKey: String(binancePaySecretKey),
        merchantId: String(binancePayMerchantId),
        instructions: 'Automated 0-fee crypto checkout with QR code scanning directly in Binance App.',
        badge: 'Instant Crypto ⚡'
      }
    };

    const withdrawalMethods = {
      jazzcash: {
        enabled: Boolean(withdrawJcEnabled),
        title: 'JazzCash (Pakistan)',
        minCoins: Number(withdrawJcMin),
        maxCoins: Number(withdrawJcMax),
        processingTime: String(withdrawJcTime),
        feePercent: 0,
        instructions: String(withdrawJcNote),
        badge: 'Fast Mobile Payout'
      },
      easypaisa: {
        enabled: Boolean(withdrawEpEnabled),
        title: 'Easypaisa (Pakistan)',
        minCoins: Number(withdrawEpMin),
        maxCoins: Number(withdrawEpMax),
        processingTime: String(withdrawEpTime),
        feePercent: 0,
        instructions: String(withdrawEpNote),
        badge: 'Instant Mobile Payout'
      },
      bankTransfer: {
        enabled: Boolean(withdrawBankEnabled),
        title: 'Pakistan Local Bank & Raast (IBAN)',
        minCoins: Number(withdrawBankMin),
        maxCoins: Number(withdrawBankMax),
        processingTime: String(withdrawBankTime),
        feePercent: 0,
        instructions: String(withdrawBankNote),
        badge: 'Direct Raast / IBAN'
      },
      usdtCrypto: {
        enabled: Boolean(withdrawUsdtEnabled),
        title: 'USDT (TRC-20) / Binance Pay',
        minCoins: Number(withdrawUsdtMin),
        maxCoins: Number(withdrawUsdtMax),
        processingTime: String(withdrawUsdtTime),
        feePercent: Number(withdrawalFeePercent || 1),
        instructions: String(withdrawUsdtNote),
        badge: 'Global Crypto'
      },
      payoneer: {
        enabled: Boolean(withdrawPayoEnabled),
        title: 'Payoneer (USD Payout)',
        minCoins: Number(withdrawPayoMin),
        maxCoins: Number(withdrawPayoMax),
        processingTime: String(withdrawPayoTime),
        feePercent: 0,
        instructions: String(withdrawPayoNote),
        badge: 'Direct USD'
      },
      sadapay: {
        enabled: Boolean(withdrawSadaEnabled),
        title: 'SadaPay / NayaPay',
        minCoins: Number(withdrawSadaMin),
        maxCoins: Number(withdrawSadaMax),
        processingTime: String(withdrawSadaTime),
        feePercent: 0,
        instructions: String(withdrawSadaNote),
        badge: 'Fintech Payout'
      }
    };

    const payload = {
      coinsPerUsd: Number(coinsPerUsd),
      pkrPerUsd: Number(pkrPerUsd),
      oneCoinUsd: 1 / Number(coinsPerUsd),
      oneCoinPkr: Number(pkrPerUsd) / Number(coinsPerUsd),
      minDepositUsd: Number(minDepositUsd),
      minWithdrawCoins: Number(minWithdrawCoins),
      maxWithdrawCoins: Number(maxWithdrawCoins),
      withdrawalProcessingTime: String(withdrawalProcessingTime),
      withdrawalFeePercent: Number(withdrawalFeePercent),
      withdrawalDailyLimitCoins: Number(withdrawalDailyLimitCoins),

      base20TesterCost: Number(base20TesterCost),
      base20Testers: Number(base20Testers),
      base20Days: Number(base20Days),

      quickCoins: Number(quickCoins),
      quickTesters: Number(quickTesters),
      quickDays: Number(quickDays),
      quickEnabled: Boolean(quickEnabled),

      proCoins: Number(proCoins),
      proTesters: Number(proTesters),
      proDays: Number(proDays),
      proEnabled: Boolean(proEnabled),

      dailyTesterPayout: Number(dailyTesterPayout),
      completionBonus: Number(completionBonus),
      platformFeePercent: Number(platformFeePercent),

      // Legacy fields
      easypaisaNumber: String(easypaisaNumber),
      easypaisaTitle: String(easypaisaTitle),
      bankDetails: `${bankName} | Acc: ${bankAccountNo} | IBAN: ${bankIban} (${bankTitle})`,
      payoneerEmail: String(payoneerEmail),
      usdtAddress: `${usdtNetwork}: ${usdtAddress} (Binance ID: ${binancePayId})`,

      // Advance Structured Setup
      manualMethods,
      apiGateways,
      withdrawalMethods,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('admin_pricing_rates', JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }

    try {
      await setDoc(doc(db, 'platform_settings', 'pricing_rates'), payload, { merge: true });
    } catch (e: any) {
      console.warn('Firestore write notice', e);
    } finally {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Dynamic Simulator Calculation
  const simTotalCost = Math.round((simTesters * simDays * (base20TesterCost / (base20Testers * base20Days))));
  const simTotalUsd = (simTotalCost / coinsPerUsd).toFixed(2);
  const simTotalPkr = Math.round((simTotalCost / coinsPerUsd) * pkrPerUsd);
  const simPlatformProfitUsd = ((simTotalCost / coinsPerUsd) * (platformFeePercent / 100)).toFixed(2);

  // Count active gateways
  const activeManualCount = [easypaisaEnabled, jazzcashEnabled, bankEnabled, usdtEnabled, payoneerEnabled, sadapayEnabled].filter(Boolean).length;
  const activeApiCount = [jcApiEnabled, epApiEnabled, stripeEnabled, binancePayEnabled].filter(Boolean).length;
  const activeWithdrawCount = [withdrawJcEnabled, withdrawEpEnabled, withdrawBankEnabled, withdrawUsdtEnabled, withdrawPayoEnabled, withdrawSadaEnabled].filter(Boolean).length;

  return (
    <div className="space-y-8 font-sans max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Payment Gateway & Coin Economics Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Setup JazzCash & Easypaisa Auto-Verify APIs, Withdrawals SLA, Manual Accounts, Stripe, and Coin exchange pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving Changes...' : 'Save Payment & Pricing Setup'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          All Payment Gateways, Withdrawal Limits, JazzCash/Easypaisa APIs, Manual Accounts & Pricing Settings saved successfully!
        </div>
      )}

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Manual Methods</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {activeManualCount} Allowed
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{activeManualCount} / 6 Active</p>
          <p className="text-xs text-slate-400 mt-1">Easypaisa, JazzCash, Bank, USDT, Payoneer</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Withdrawal Gateways</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {activeWithdrawCount} Allowed
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{activeWithdrawCount} Active Payouts</p>
          <p className="text-xs text-slate-400 mt-1">SLA: {withdrawalProcessingTime}</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Coin Exchange</span>
          <p className="text-2xl font-black text-amber-400 mt-2">${(1 / coinsPerUsd).toFixed(3)} USD</p>
          <p className="text-xs text-slate-400 mt-1">100 Coins = $1.00 USD (Rs {pkrPerUsd} PKR)</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform Profit Margin</span>
          <p className="text-2xl font-black text-indigo-400 mt-2">{platformFeePercent}% Platform Net</p>
          <p className="text-xs text-slate-400 mt-1">Direct cut per campaign test run</p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('economics')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
            activeTab === 'economics'
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          Coin Economics & Testing Packages
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Withdrawal Settings & Payout Gateways
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-extrabold">
            {activeWithdrawCount} ON
          </span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Manual Payment Accounts (Deposits)
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold">
            {activeManualCount} ON
          </span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
            activeTab === 'api'
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          Automated Auto-Verify APIs
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold">
            {activeApiCount} ON
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-purple-600/20 text-purple-400 border-purple-500/40 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          Deposit & Payout Security Rules
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COIN ECONOMICS & PACKAGES */}
      {/* ======================================================== */}
      {activeTab === 'economics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" /> Master Currency & Coin Conversion Rates
              </h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Affects all User Calculations
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Coins per 1 $ USD Dollar</label>
                <div className="relative">
                  <input 
                    type="number" value={coinsPerUsd} min={1}
                    onChange={(e) => setCoinsPerUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Result: 1 Coin = ${(1 / coinsPerUsd).toFixed(3)} USD</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">1 USD to PKR Exchange Rate</label>
                <div className="relative">
                  <input 
                    type="number" value={pkrPerUsd} min={1}
                    onChange={(e) => setPkrPerUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">PKR</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Result: 1 Coin = Rs {(pkrPerUsd / coinsPerUsd).toFixed(2)} PKR</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Minimum Deposit Limit ($ USD)</label>
                <div className="relative">
                  <input 
                    type="number" value={minDepositUsd} min={1}
                    onChange={(e) => setMinDepositUsd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">USD</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{minDepositUsd * coinsPerUsd} Coins minimum</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Minimum Tester Withdrawal (Coins)</label>
                <div className="relative">
                  <input 
                    type="number" value={minWithdrawCoins} min={100} step={100}
                    onChange={(e) => setMinWithdrawCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">≈ ${(minWithdrawCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((minWithdrawCoins / coinsPerUsd) * pkrPerUsd)} PKR)</p>
              </div>
            </div>
          </div>

          {/* 3 TESTING PACKAGES */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" /> 3 Core Testing Packages Config
              </h2>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Shown to Developers on Campaign Creation
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Google Play Standard
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Always Active
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">Full Play Store Compliance</h3>
                <p className="text-[11px] text-slate-400 mt-1">Standard 20 testers for 14 continuous days.</p>

                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                    <input 
                      type="number" value={base20TesterCost}
                      onChange={(e) => setBase20TesterCost(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      = ${(base20TesterCost / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((base20TesterCost / coinsPerUsd) * pkrPerUsd)} PKR)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                      <input 
                        type="number" value={base20Testers}
                        onChange={(e) => setBase20Testers(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                      <input 
                        type="number" value={base20Days}
                        onChange={(e) => setBase20Days(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-slate-900/80 border rounded-2xl p-5 relative ${quickEnabled ? 'border-indigo-500/30' : 'border-slate-800 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Quick Audit
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" checked={quickEnabled}
                      onChange={(e) => setQuickEnabled(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-[10px] font-bold text-slate-300">Enabled</span>
                  </label>
                </div>
                <h3 className="text-sm font-black text-white">Starter Feedback Pack</h3>
                <p className="text-[11px] text-slate-400 mt-1">Ideal for pre-launch bug hunting.</p>

                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                    <input 
                      type="number" value={quickCoins}
                      onChange={(e) => setQuickCoins(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      = ${(quickCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((quickCoins / coinsPerUsd) * pkrPerUsd)} PKR)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                      <input 
                        type="number" value={quickTesters}
                        onChange={(e) => setQuickTesters(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                      <input 
                        type="number" value={quickDays}
                        onChange={(e) => setQuickDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-slate-900/80 border rounded-2xl p-5 relative ${proEnabled ? 'border-purple-500/30' : 'border-slate-800 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Pro Coverage
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" checked={proEnabled}
                      onChange={(e) => setProEnabled(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-0"
                    />
                    <span className="text-[10px] font-bold text-slate-300">Enabled</span>
                  </label>
                </div>
                <h3 className="text-sm font-black text-white">Enterprise Studio Coverage</h3>
                <p className="text-[11px] text-slate-400 mt-1">Extensive 30 testers for 14 full days.</p>

                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Total Cost (Coins):</label>
                    <input 
                      type="number" value={proCoins}
                      onChange={(e) => setProCoins(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      = ${(proCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((proCoins / coinsPerUsd) * pkrPerUsd)} PKR)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Testers:</label>
                      <input 
                        type="number" value={proTesters}
                        onChange={(e) => setProTesters(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Days:</label>
                      <input 
                        type="number" value={proDays}
                        onChange={(e) => setProDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-indigo-500/20">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-indigo-400" /> Live Campaign Cost & Profit Simulator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                    <span>Testers Count:</span>
                    <span className="text-indigo-400 font-black">{simTesters} Testers</span>
                  </div>
                  <input 
                    type="range" min={10} max={50} step={5} value={simTesters}
                    onChange={(e) => setSimTesters(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                    <span>Duration (Days):</span>
                    <span className="text-indigo-400 font-black">{simDays} Days</span>
                  </div>
                  <input 
                    type="range" min={7} max={30} step={7} value={simDays}
                    onChange={(e) => setSimDays(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Charged to Customer</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-400">{simTotalCost.toLocaleString()} Coins</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold mt-1">≈ ${simTotalUsd} USD (Rs {simTotalPkr.toLocaleString()} PKR)</p>
              </div>

              <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20 flex flex-col justify-center">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Platform Net Profit ({platformFeePercent}%)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-indigo-400">${simPlatformProfitUsd} USD</span>
                </div>
                <p className="text-xs text-indigo-300 font-medium mt-1">Direct Profit per this campaign</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: WITHDRAWAL LIMITS, SLA & PAYOUT GATEWAYS */}
      {/* ======================================================== */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Master Policy Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">Global Withdrawal Rules & SLA Processing Time</h2>
                  <p className="text-xs text-slate-400">Controls payout limits, processing duration, and platform withdrawal fees.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                SLA: {withdrawalProcessingTime}
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Minimum Withdrawal Limit (Coins)</label>
                <div className="relative">
                  <input 
                    type="number" value={minWithdrawCoins} min={100} step={100}
                    onChange={(e) => setMinWithdrawCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                  ≈ ${(minWithdrawCoins / coinsPerUsd).toFixed(2)} USD (Rs {Math.round((minWithdrawCoins / coinsPerUsd) * pkrPerUsd)} PKR)
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Maximum Withdrawal Limit (Coins)</label>
                <div className="relative">
                  <input 
                    type="number" value={maxWithdrawCoins} min={1000} step={1000}
                    onChange={(e) => setMaxWithdrawCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Coins</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Per transaction maximum</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Processing SLA Time (Shown to User)</label>
                <input 
                  type="text" value={withdrawalProcessingTime}
                  onChange={(e) => setWithdrawalProcessingTime(e.target.value)}
                  placeholder="e.g. 1 to 24 Hours"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">e.g. "1 to 24 Hours" or "Instant (15-30 mins)"</p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Platform Withdrawal Fee (%)</label>
                <div className="relative">
                  <input 
                    type="number" value={withdrawalFeePercent} min={0} max={50}
                    onChange={(e) => setWithdrawalFeePercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">0% for zero fee payouts</p>
              </div>
            </div>
          </div>

          {/* Method by Method Payout Gateways */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* 1. JAZZCASH WITHDRAWAL */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawJcEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400 font-black">JC</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">JazzCash (Pakistan)</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">Mobile Wallet Payout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawJcEnabled} 
                    onChange={(e) => setWithdrawJcEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawJcMin}
                      onChange={(e) => setWithdrawJcMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawJcMax}
                      onChange={(e) => setWithdrawJcMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawJcTime}
                    onChange={(e) => setWithdrawJcTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawJcNote}
                    onChange={(e) => setWithdrawJcNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 2. EASYPAISA WITHDRAWAL */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawEpEnabled ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 font-black">EP</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Easypaisa (Pakistan)</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">Instant Mobile Wallet</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawEpEnabled} 
                    onChange={(e) => setWithdrawEpEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawEpMin}
                      onChange={(e) => setWithdrawEpMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawEpMax}
                      onChange={(e) => setWithdrawEpMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawEpTime}
                    onChange={(e) => setWithdrawEpTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawEpNote}
                    onChange={(e) => setWithdrawEpNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 3. BANK TRANSFER / RAAST WITHDRAWAL */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawBankEnabled ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 font-black">IBAN</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Local Bank & Raast (IBAN)</h4>
                    <span className="text-[10px] text-blue-400 font-semibold">Direct Bank Payout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawBankEnabled} 
                    onChange={(e) => setWithdrawBankEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawBankMin}
                      onChange={(e) => setWithdrawBankMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawBankMax}
                      onChange={(e) => setWithdrawBankMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawBankTime}
                    onChange={(e) => setWithdrawBankTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawBankNote}
                    onChange={(e) => setWithdrawBankNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 4. USDT TRC20 / BINANCE PAY */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawUsdtEnabled ? 'border-teal-500/40 shadow-lg shadow-teal-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400 font-black">₮</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">USDT (TRC-20) / Binance Pay</h4>
                    <span className="text-[10px] text-teal-400 font-semibold">Worldwide Crypto Payout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawUsdtEnabled} 
                    onChange={(e) => setWithdrawUsdtEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawUsdtMin}
                      onChange={(e) => setWithdrawUsdtMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawUsdtMax}
                      onChange={(e) => setWithdrawUsdtMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawUsdtTime}
                    onChange={(e) => setWithdrawUsdtTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawUsdtNote}
                    onChange={(e) => setWithdrawUsdtNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 5. PAYONEER USD */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawPayoEnabled ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 font-black">P</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Payoneer / Wise (USD)</h4>
                    <span className="text-[10px] text-indigo-400 font-semibold">Direct USD Email Payout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawPayoEnabled} 
                    onChange={(e) => setWithdrawPayoEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawPayoMin}
                      onChange={(e) => setWithdrawPayoMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawPayoMax}
                      onChange={(e) => setWithdrawPayoMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawPayoTime}
                    onChange={(e) => setWithdrawPayoTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawPayoNote}
                    onChange={(e) => setWithdrawPayoNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 6. SADAPAY / NAYAPAY */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${withdrawSadaEnabled ? 'border-orange-500/40 shadow-lg shadow-orange-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400 font-black">SP</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">SadaPay / NayaPay</h4>
                    <span className="text-[10px] text-orange-400 font-semibold">Pakistani Fintech Wallet</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={withdrawSadaEnabled} 
                    onChange={(e) => setWithdrawSadaEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Min Coins:</label>
                    <input 
                      type="number" value={withdrawSadaMin}
                      onChange={(e) => setWithdrawSadaMin(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Coins:</label>
                    <input 
                      type="number" value={withdrawSadaMax}
                      onChange={(e) => setWithdrawSadaMax(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Processing Time:</label>
                  <input 
                    type="text" value={withdrawSadaTime}
                    onChange={(e) => setWithdrawSadaTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={withdrawSadaNote}
                    onChange={(e) => setWithdrawSadaNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANUAL PAYMENT METHODS (DEPOSITS) */}
      {/* ======================================================== */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Manual Payment Accounts (Direct Transfer)</h3>
                <p className="text-xs text-slate-400">Users will copy your account info and submit a Transaction ID (TID) / Screenshot receipt.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">{activeManualCount} Allowed in User Portal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 1. EASYPAISA MANUAL */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${easypaisaEnabled ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📱</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Easypaisa (Pakistan)</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">PKR Mobile Wallet</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={easypaisaEnabled} 
                    onChange={(e) => setEasypaisaEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Title (Name):</label>
                  <input 
                    type="text" value={easypaisaTitle}
                    onChange={(e) => setEasypaisaTitle(e.target.value)}
                    placeholder="e.g. Umar Hayat"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Easypaisa Mobile Number:</label>
                  <input 
                    type="text" value={easypaisaNumber}
                    onChange={(e) => setEasypaisaNumber(e.target.value)}
                    placeholder="e.g. 0300-1234567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={easypaisaNote}
                    onChange={(e) => setEasypaisaNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 2. JAZZCASH MANUAL */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${jazzcashEnabled ? 'border-red-500/40 shadow-lg shadow-red-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">JazzCash (Pakistan)</h4>
                    <span className="text-[10px] text-red-400 font-semibold">PKR Mobile Wallet</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={jazzcashEnabled} 
                    onChange={(e) => setJazzcashEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Title (Name):</label>
                  <input 
                    type="text" value={jazzcashTitle}
                    onChange={(e) => setJazzcashTitle(e.target.value)}
                    placeholder="e.g. Umar Hayat"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">JazzCash Mobile Number:</label>
                  <input 
                    type="text" value={jazzcashNumber}
                    onChange={(e) => setJazzcashNumber(e.target.value)}
                    placeholder="e.g. 0301-7654321"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions for User:</label>
                  <textarea 
                    rows={2} value={jazzcashNote}
                    onChange={(e) => setJazzcashNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 3. PAKISTAN LOCAL BANK */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition md:col-span-2 ${bankEnabled ? 'border-teal-500/40 shadow-lg shadow-teal-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏦</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pakistan Local Bank Transfer & Raast ID</h4>
                    <span className="text-[10px] text-teal-400 font-semibold">Meezan / HBL / UBL / Raast (Instant PKR)</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={bankEnabled} 
                    onChange={(e) => setBankEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Bank Name:</label>
                  <input 
                    type="text" value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Meezan Bank Ltd"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Title:</label>
                  <input 
                    type="text" value={bankTitle}
                    onChange={(e) => setBankTitle(e.target.value)}
                    placeholder="e.g. Umar Hayat"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Number:</label>
                  <input 
                    type="text" value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    placeholder="e.g. 01020304050607"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">24-Digit IBAN:</label>
                  <input 
                    type="text" value={bankIban}
                    onChange={(e) => setBankIban(e.target.value)}
                    placeholder="e.g. PK64MEZN0000001020304050"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Raast ID (Instant):</label>
                  <input 
                    type="text" value={bankRaastId}
                    onChange={(e) => setBankRaastId(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instructions:</label>
                  <input 
                    type="text" value={bankNote}
                    onChange={(e) => setBankNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 4. USDT TRC20 / CRYPTO */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${usdtEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">₮</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">USDT Crypto & Binance Pay</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">TRC-20 / BEP-20 / Binance Pay ID</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={usdtEnabled} 
                    onChange={(e) => setUsdtEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Crypto Network:</label>
                  <input 
                    type="text" value={usdtNetwork}
                    onChange={(e) => setUsdtNetwork(e.target.value)}
                    placeholder="e.g. USDT TRC-20 (Tron)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Wallet Address (TRC-20):</label>
                  <input 
                    type="text" value={usdtAddress}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    placeholder="e.g. T9yD14Nj9yDbvW..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Binance Pay ID (Optional):</label>
                  <input 
                    type="text" value={binancePayId}
                    onChange={(e) => setBinancePayId(e.target.value)}
                    placeholder="e.g. 827491039"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 5. PAYONEER */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${payoneerEnabled ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Payoneer / Wise (USD)</h4>
                    <span className="text-[10px] text-indigo-400 font-semibold">International Direct Wire</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={payoneerEnabled} 
                    onChange={(e) => setPayoneerEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Title:</label>
                  <input 
                    type="text" value={payoneerTitle}
                    onChange={(e) => setPayoneerTitle(e.target.value)}
                    placeholder="e.g. 12 Test Gig LLC"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Receiving Email:</label>
                  <input 
                    type="email" value={payoneerEmail}
                    onChange={(e) => setPayoneerEmail(e.target.value)}
                    placeholder="pay@12testgig.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 6. SADAPAY */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${sadapayEnabled ? 'border-teal-500/40 shadow-lg shadow-teal-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">SadaPay / NayaPay (Fintech)</h4>
                    <span className="text-[10px] text-teal-400 font-semibold">PKR Mobile Wallet</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={sadapayEnabled} 
                    onChange={(e) => setSadapayEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Account Title:</label>
                  <input 
                    type="text" value={sadapayTitle}
                    onChange={(e) => setSadapayTitle(e.target.value)}
                    placeholder="e.g. Umar Hayat"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mobile Number:</label>
                  <input 
                    type="text" value={sadapayNumber}
                    onChange={(e) => setSadapayNumber(e.target.value)}
                    placeholder="e.g. 0300-1234567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUTOMATED AUTO-VERIFY API GATEWAYS */}
      {/* ======================================================== */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Automated Instant API Gateways (Auto Deposit Verification)</h3>
                <p className="text-xs text-slate-400">When users pay via JazzCash / Easypaisa Merchant APIs or Stripe, coins are credited instantly via Webhook IPN.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-400">{activeApiCount} Automated APIs Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* 1. JAZZCASH MERCHANT API */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${jcApiEnabled ? 'border-red-500/50 shadow-lg shadow-red-500/10 ring-1 ring-red-500/20' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-black">JC</div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      JazzCash Merchant API <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 text-[9px] rounded font-bold">Auto-Verify ⚡</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Direct MWALLET / Mobile OTP & Cards</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={jcApiMode}
                    onChange={(e) => setJcApiMode(e.target.value as 'sandbox' | 'live')}
                    className="bg-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="sandbox">🧪 Sandbox</option>
                    <option value="live">🟢 Live Prod</option>
                  </select>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" checked={jcApiEnabled} 
                      onChange={(e) => setJcApiEnabled(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Merchant ID (pp_MerchantID):</label>
                  <input 
                    type="text" value={jcMerchantId}
                    onChange={(e) => setJcMerchantId(e.target.value)}
                    placeholder="e.g. MC12345 or sandbox merchant ID"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">API Password (pp_Password):</label>
                  <input 
                    type="text" value={jcPassword}
                    onChange={(e) => setJcPassword(e.target.value)}
                    placeholder="e.g. 5x89a..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Integrity Salt / Secret Hash Key:</label>
                  <div className="relative">
                    <input 
                      type={showJcSalt ? "text" : "password"} 
                      value={jcIntegritySalt}
                      onChange={(e) => setJcIntegritySalt(e.target.value)}
                      placeholder="e.g. 9p7x2k4m..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowJcSalt(!showJcSalt)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showJcSalt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Your IPN Webhook Callback URL:</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" readOnly value="https://12testgig.com/api/webhooks/payment/jazzcash"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-400 font-mono text-[10px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleCopy('https://12testgig.com/api/webhooks/payment/jazzcash', 'jc_webhook')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                    >
                      {copiedField === 'jc_webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Status: {jcApiEnabled ? (jcApiMode === 'live' ? '🟢 Live Production' : '🧪 Sandbox Testing') : '⚪ Inactive'}</span>
                  <button 
                    type="button"
                    onClick={() => handleTestGateway('jazzcash')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 font-bold rounded-lg transition text-[11px] cursor-pointer"
                  >
                    {testApiSuccess === 'jazzcash' ? '✓ API Connected!' : 'Test JazzCash API'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. EASYPAISA DIRECTPAY API */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${epApiEnabled ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-400 font-black">EP</div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Easypaisa DirectPay API <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-bold">Auto-Verify ⚡</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Instant Mobile Checkout & Open API</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={epApiMode}
                    onChange={(e) => setEpApiMode(e.target.value as 'sandbox' | 'live')}
                    className="bg-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="sandbox">🧪 Sandbox</option>
                    <option value="live">🟢 Live Prod</option>
                  </select>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" checked={epApiEnabled} 
                      onChange={(e) => setEpApiEnabled(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Store ID (storeId):</label>
                  <input 
                    type="text" value={epStoreId}
                    onChange={(e) => setEpStoreId(e.target.value)}
                    placeholder="e.g. 10293 or Easypaisa Store ID"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hash Key / Secret Key:</label>
                  <div className="relative">
                    <input 
                      type={showEpHash ? "text" : "password"} 
                      value={epHashKey}
                      onChange={(e) => setEpHashKey(e.target.value)}
                      placeholder="e.g. ep_secret_hash_key"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowEpHash(!showEpHash)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showEpHash ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Merchant Mobile / Account Number:</label>
                  <input 
                    type="text" value={epAccountNum}
                    onChange={(e) => setEpAccountNum(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Your IPN Callback URL:</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" readOnly value="https://12testgig.com/api/webhooks/payment/easypaisa"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-400 font-mono text-[10px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleCopy('https://12testgig.com/api/webhooks/payment/easypaisa', 'ep_webhook')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                    >
                      {copiedField === 'ep_webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Status: {epApiEnabled ? (epApiMode === 'live' ? '🟢 Live Production' : '🧪 Sandbox') : '⚪ Inactive'}</span>
                  <button 
                    type="button"
                    onClick={() => handleTestGateway('easypaisa')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg transition text-[11px] cursor-pointer"
                  >
                    {testApiSuccess === 'easypaisa' ? '✓ API Connected!' : 'Test Easypaisa API'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. STRIPE GATEWAY */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${stripeEnabled ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 font-black">S</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Stripe (Visa / Mastercard / Amex)</h4>
                    <span className="text-[10px] text-blue-400 font-semibold">Global Automated Cards</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={stripeMode}
                    onChange={(e) => setStripeMode(e.target.value as 'sandbox' | 'live')}
                    className="bg-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="sandbox">🧪 Sandbox</option>
                    <option value="live">🟢 Live</option>
                  </select>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" checked={stripeEnabled} 
                      onChange={(e) => setStripeEnabled(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Publishable Key (pk_test / pk_live):</label>
                  <input 
                    type="text" value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    placeholder="pk_test_51Mz..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Secret Key (sk_test / sk_live):</label>
                  <div className="relative">
                    <input 
                      type={showStripeSecret ? "text" : "password"} 
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder="sk_test_51Mz..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowStripeSecret(!showStripeSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showStripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Status: {stripeEnabled ? (stripeMode === 'live' ? '🟢 Live' : '🧪 Sandbox') : '⚪ Inactive'}</span>
                  <button 
                    type="button"
                    onClick={() => handleTestGateway('stripe')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold rounded-lg transition text-[11px] cursor-pointer"
                  >
                    {testApiSuccess === 'stripe' ? '✓ API Connected!' : 'Test Stripe'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. BINANCE PAY API */}
            <div className={`bg-[#0f172a] rounded-2xl border p-5 transition ${binancePayEnabled ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 font-black">₮</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Binance Pay Instant API</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">Automated 0-Fee Crypto</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={binancePayMode}
                    onChange={(e) => setBinancePayMode(e.target.value as 'sandbox' | 'live')}
                    className="bg-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="sandbox">🧪 Sandbox</option>
                    <option value="live">🟢 Live</option>
                  </select>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" checked={binancePayEnabled} 
                      onChange={(e) => setBinancePayEnabled(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Merchant ID:</label>
                  <input 
                    type="text" value={binancePayMerchantId}
                    onChange={(e) => setBinancePayMerchantId(e.target.value)}
                    placeholder="e.g. 827491039"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">API Key:</label>
                  <input 
                    type="text" value={binancePayApiKey}
                    onChange={(e) => setBinancePayApiKey(e.target.value)}
                    placeholder="binance_api_key_..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Secret Key:</label>
                  <div className="relative">
                    <input 
                      type={showBinanceSecret ? "text" : "password"} 
                      value={binancePaySecretKey}
                      onChange={(e) => setBinancePaySecretKey(e.target.value)}
                      placeholder="binance_secret_..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowBinanceSecret(!showBinanceSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showBinanceSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Status: {binancePayEnabled ? (binancePayMode === 'live' ? '🟢 Live Production' : '🧪 Sandbox') : '⚪ Inactive'}</span>
                  <button 
                    type="button"
                    onClick={() => handleTestGateway('binance')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg transition text-[11px] cursor-pointer"
                  >
                    {testApiSuccess === 'binance' ? '✓ API Connected!' : 'Test Binance Pay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DEPOSIT RULES & FRAUD PROTECTION */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-6 text-xs">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Deposit Verification & Anti-Scam Rules
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure auto-approval triggers, manual verification checks, and coin allocation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">Manual Deposit Verifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Require Screenshot / Receipt Upload</p>
                    <p className="text-[11px] text-slate-400">Users must upload clear proof of bank / wallet transfer</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold">Mandatory</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <p className="font-bold text-white">Require Transaction ID (TID)</p>
                    <p className="text-[11px] text-slate-400">Enforces unique TID to prevent duplicate submissions</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold">Mandatory</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">Automated Instant Webhooks</h4>
                
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Your Platform Webhook URL:</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" readOnly value="https://12testgig.com/api/webhooks/payment/jazzcash"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-400 font-mono text-[11px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleCopy('https://12testgig.com/api/webhooks/payment/jazzcash', 'webhook')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedField === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Paste this Webhook in JazzCash / Easypaisa Merchant Portal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
