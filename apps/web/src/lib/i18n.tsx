'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'ur' | 'ru';

export interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, defaultVal?: string) => string;
  isRTL: boolean;
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'nav.developers': 'For Developers',
    'nav.testers': 'For Testers',
    'nav.pricing': 'Pricing Plans',
    'nav.blog': 'Blog & Guides',
    'nav.support': 'Support Desk',
    'nav.get20': 'Get 20 Testers',
    'hero.badge': 'Pass Google Play Closed Testing Guaranteed • 2026 Ready',
    'hero.title1': 'Get',
    'hero.title2': '20 Real Testers',
    'hero.title3': 'for 14 Days. Pass Production Review.',
    'hero.subtitle': "Meet Google Play's 20-tester closed testing requirement effortlessly. Certified Android testers test your APK daily on real physical devices with verified screenshot telemetry and actionable bug reports.",
    'hero.approvalRate': 'Approval Rate on Google Play',
    'hero.continuousDays': 'Continuous Daily Testing',
    'hero.zeroBots': '100% Real Physical Devices',
    'auth.createTitle': 'Create Free Account',
    'auth.loginTitle': 'Sign In to Portal',
    'auth.createSub': 'Start testing your app or earn coins today',
    'auth.loginSub': 'Access your active campaigns & wallet',
    'auth.register': 'Register',
    'auth.login': 'Login',
    'auth.rolePrompt': 'I Want To:',
    'auth.appCreator': 'App Creator',
    'auth.need20': 'Need 20 Testers',
    'auth.certifiedTester': 'Certified Tester',
    'auth.earnReal': 'Earn Real Cash',
    'auth.fullName': 'Full Name / Studio',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.btnCreator': 'Create Account & Get 500 Bonus Coins',
    'auth.btnTester': 'Join as Tester & Start Earning',
    'auth.btnSignIn': 'Sign In to Dashboard',
    'testers.badge': 'Earn Real Money',
    'testers.title': 'Test Android Apps & Earn Daily Cash from Your Phone',
    'testers.subtitle': 'Join thousands of certified testers in Pakistan and worldwide. Test new apps for 3-5 minutes daily and cash out instantly.',
    'testers.payoutChannels': 'Instant Payout Channels Supported',
    'testers.payoutTitle': 'Cashout to JazzCash, Easypaisa, SadaPay, Bank IBAN & USDT',
    'testers.payoutSub': 'No hidden fees. Minimum payout starts at just 500 Coins with guaranteed 1 to 24 hour processing time.',
    'testers.joinBtn': 'Join as Certified Tester',
    'pricing.badge': 'Transparent Pricing',
    'pricing.title': 'Pre-Configured Google Play Testing Plans',
    'pricing.subtitle': 'Pay in USD or PKR via JazzCash, Easypaisa, Local Bank Transfer, or USDT Crypto.',
    'pricing.selectPlan': 'Select Plan',
    'reviews.badge': 'Social Proof & Reviews',
    'reviews.title': 'Loved by Android Creators Worldwide'
  },
  ur: {
    'nav.developers': 'ڈویلپرز کے لیے',
    'nav.testers': 'ٹیسٹرز کے لیے',
    'nav.pricing': 'قیمت اور پیکجز',
    'nav.blog': 'بلاگ اور گائیڈز',
    'nav.support': 'ہیلپ ڈیسک',
    'nav.get20': '20 ٹیسٹرز حاصل کریں',
    'hero.badge': 'گوگل پلے کلوزڈ ٹیسٹنگ پاس کرنے کی 100% گارنٹی • 2026',
    'hero.title1': 'حاصل کریں',
    'hero.title2': '20 اصلی ٹیسٹرز',
    'hero.title3': '14 دن کے لیے۔ پروڈکشن ریویو پاس کریں۔',
    'hero.subtitle': 'گوگل پلے کی 20 ٹیسٹرز اور 14 دن کی شرط آسانی سے پوری کریں۔ حقیقی اینڈرائڈ ڈیوائسز پر روزانہ ایپ ٹیسٹنگ، اسکرین شاٹ پروف اور مستند بگ رپورٹس۔',
    'hero.approvalRate': 'گوگل پلے منظوری کی شرح',
    'hero.continuousDays': 'مسلسل روزانہ ٹیسٹنگ',
    'hero.zeroBots': '100% اصلی اینڈرائڈ فونز (کوئی بوٹ نہیں)',
    'auth.createTitle': 'مفت اکاؤنٹ بنائیں',
    'auth.loginTitle': 'لاگ ان کریں',
    'auth.createSub': 'اپنی ایپ ٹیسٹ کروائیں یا روزانہ پیسے کمائیں',
    'auth.loginSub': 'اپنے ڈیش بورڈ اور والیٹ تک رسائی حاصل کریں',
    'auth.register': 'رجسٹر',
    'auth.login': 'لاگ ان',
    'auth.rolePrompt': 'آپ کا مقصد:',
    'auth.appCreator': 'ایپ کریئیٹر',
    'auth.need20': '20 ٹیسٹرز چاہئیں',
    'auth.certifiedTester': 'سرٹیفائیڈ ٹیسٹر',
    'auth.earnReal': 'روزانہ پیسے کمائیں',
    'auth.fullName': 'پورا نام / اسٹوڈیو',
    'auth.email': 'ای میل ایڈریس',
    'auth.password': 'پاس ورڈ',
    'auth.btnCreator': 'اکاؤنٹ بنائیں اور 500 بونس کوائنز پائیں',
    'auth.btnTester': 'بطور ٹیسٹر شامل ہوں اور کمانا شروع کریں',
    'auth.btnSignIn': 'ڈیش بورڈ میں لاگ ان کریں',
    'testers.badge': 'روزانہ نقد کمائی',
    'testers.title': 'اپنے موبائل پر ایپس ٹیسٹ کریں اور روزانہ پیسے کمائیں',
    'testers.subtitle': 'پاکستان اور دنیا بھر کے ہزاروں ٹیسٹرز کے ساتھ شامل ہوں۔ روزانہ 3 سے 5 منٹ ایپ چلائیں اور فورا پیسے نکالیں۔',
    'testers.payoutChannels': 'فوری ادائیگی کے طریقے',
    'testers.payoutTitle': 'جاز کیش، ایزی پیسہ، سادہ پے، بینک اکاؤنٹ اور USDT میں رقم وصول کریں',
    'testers.payoutSub': 'کوئی اضافی فیس نہیں۔ کم سے کم ادائیگی صرف 500 کوائنز اور 1 سے 24 گھنٹے میں منتقلی۔',
    'testers.joinBtn': 'بطور ٹیسٹر رجسٹر ہوں',
    'pricing.badge': 'شفاف قیمتیں',
    'pricing.title': 'گوگل پلے ٹیسٹنگ پیکجز',
    'pricing.subtitle': 'جاز کیش، ایزی پیسہ، بینک ٹرانسفر یا کرپٹو USDT کے ذریعے ادائیگی کریں۔',
    'pricing.selectPlan': 'پیکج منتخب کریں',
    'reviews.badge': 'ریٹنگ اور آراء',
    'reviews.title': 'اینڈرائڈ ڈویلپرز کا سب سے قابل اعتماد پلیٹ فارم'
  },
  ru: {
    'nav.developers': 'Developers Ke Liye',
    'nav.testers': 'Testers Ke Liye',
    'nav.pricing': 'Pricing Plans',
    'nav.blog': 'Blog & Guides',
    'nav.support': 'Help Desk',
    'nav.get20': '20 Testers Hasil Karein',
    'hero.badge': 'Google Play Closed Testing Pass Guarantee • 2026 Ready',
    'hero.title1': 'Hasil Karein',
    'hero.title2': '20 Real Testers',
    'hero.title3': '14 Din Ke Liye. Production Approval Guaranteed.',
    'hero.subtitle': 'Google Play ki 20 testers aur 14 din ki policy asani se pass karein. Real physical Android phones per daily active testing aur verified screenshot telemetry.',
    'hero.approvalRate': 'Google Play Approval Rate',
    'hero.continuousDays': 'Continuous Daily Testing',
    'hero.zeroBots': '100% Real Physical Devices (0 Bots)',
    'auth.createTitle': 'Muft Account Banayein',
    'auth.loginTitle': 'Sign In Karein',
    'auth.createSub': 'App test karwayein ya rozana paise kamayein',
    'auth.loginSub': 'Apne active campaigns aur wallet me jayein',
    'auth.register': 'Register',
    'auth.login': 'Login',
    'auth.rolePrompt': 'Aapka Maqsad:',
    'auth.appCreator': 'App Creator',
    'auth.need20': '20 Testers Chahiyen',
    'auth.certifiedTester': 'Certified Tester',
    'auth.earnReal': 'Rozana Cash Kamayein',
    'auth.fullName': 'Poora Naam / Studio',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.btnCreator': 'Account Banayein & 500 Bonus Coins Payein',
    'auth.btnTester': 'Tester Banein & Kamana Shuru Karein',
    'auth.btnSignIn': 'Dashboard Me Login Karein',
    'testers.badge': 'Real Cash Earnings',
    'testers.title': 'Phone Per Apps Test Karein Aur Daily Cash Kamayein',
    'testers.subtitle': 'Pakistan aur worldwide hazaron certified testers me shamil hon. Daily 3-5 mins app use karein aur foran cashout karein.',
    'testers.payoutChannels': 'Instant Payout Channels Supported',
    'testers.payoutTitle': 'JazzCash, Easypaisa, SadaPay, Bank IBAN & USDT Me Cashout',
    'testers.payoutSub': 'Koi hidden charges nahi. Min payout sirf 500 Coins aur 1-24 hours me transfer guarantee.',
    'testers.joinBtn': 'Join as Certified Tester',
    'pricing.badge': 'Transparent Pricing',
    'pricing.title': 'Google Play Testing Packages',
    'pricing.subtitle': 'JazzCash, Easypaisa, Local Bank Transfer ya USDT Crypto se payment karein.',
    'pricing.selectPlan': 'Plan Select Karein',
    'reviews.badge': 'Social Proof & Reviews',
    'reviews.title': 'Loved by Android Creators Worldwide'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k, d) => d || k,
  isRTL: false
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language') as LanguageCode;
      if (saved && (saved === 'en' || saved === 'ur' || saved === 'ru')) {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', newLang);
      document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  const t = (key: string, defaultVal?: string) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || defaultVal || TRANSLATIONS.en[key] || key;
  };

  const isRTL = lang === 'ur';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-urdu' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
