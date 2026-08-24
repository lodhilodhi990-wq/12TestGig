import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string; // e.g. ca-pub-1234567890123456
  autoAdsEnabled: boolean;
  headerBannerCode?: string;
  inFeedCode?: string;
  sidebarCode?: string;
  updatedAt?: string;
}

export const defaultAdSenseConfig: AdSenseConfig = {
  enabled: false,
  publisherId: '',
  autoAdsEnabled: false,
  headerBannerCode: '',
  inFeedCode: '',
  sidebarCode: '',
};

export const subscribeToAdSenseConfig = (callback: (config: AdSenseConfig) => void) => {
  try {
    return onSnapshot(doc(db, 'platform_settings', 'adsense_config'), (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...defaultAdSenseConfig, ...(snapshot.data() as AdSenseConfig) });
      } else {
        callback(defaultAdSenseConfig);
      }
    }, (err) => {
      console.warn('AdSense config listener warning:', err);
      callback(defaultAdSenseConfig);
    });
  } catch (e) {
    console.warn('AdSense subscription catch:', e);
    callback(defaultAdSenseConfig);
    return () => {};
  }
};
