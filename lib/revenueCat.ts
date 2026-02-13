import { Platform } from 'react-native';
import { Purchases } from 'react-native-purchases';
import Constants from 'expo-constants';

const iosKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_RC_IOS_API_KEY ?? process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? '';
const androidKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? '';

export async function initRevenueCat(): Promise<void> {
  const apiKey = Platform.OS === 'ios' ? iosKey : androidKey;
  if (!apiKey) {
    if (__DEV__) console.log('[RevenueCat] No API key; subscription features disabled.');
    return;
  }
  try {
    await Purchases.configure({ apiKey });
    if (__DEV__) console.log('[RevenueCat] Configured.');
  } catch (e) {
    console.warn('[RevenueCat] Configure failed:', e);
  }
}
