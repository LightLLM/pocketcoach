import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, Coach, ChatSession } from '@/types/coach';

const KEYS = {
  ONBOARDING_DONE: '@pocketcoach/onboarding_done',
  USER_PROFILE: '@pocketcoach/user_profile',
  CUSTOM_COACHES: '@pocketcoach/custom_coaches',
  CHAT_SESSIONS: '@pocketcoach/chat_sessions',
  DAILY_MESSAGE_COUNT: '@pocketcoach/daily_message_count',
  DAILY_MESSAGE_DATE: '@pocketcoach/daily_message_date',
} as const;

export async function getOnboardingDone(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return v === 'true';
}

export async function setOnboardingDone(done: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, done ? 'true' : 'false');
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.USER_PROFILE,
    JSON.stringify({ ...profile, updatedAt: Date.now() })
  );
}

export async function getCustomCoaches(): Promise<Coach[]> {
  const raw = await AsyncStorage.getItem(KEYS.CUSTOM_COACHES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Coach[];
  } catch {
    return [];
  }
}

export async function setCustomCoaches(coaches: Coach[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.CUSTOM_COACHES, JSON.stringify(coaches));
}

export async function getChatSessions(): Promise<Record<string, ChatSession>> {
  const raw = await AsyncStorage.getItem(KEYS.CHAT_SESSIONS);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, ChatSession>;
  } catch {
    return {};
  }
}

export async function setChatSessions(sessions: Record<string, ChatSession>): Promise<void> {
  await AsyncStorage.setItem(KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
}

async function getDailyMessageDate(): Promise<string> {
  const v = await AsyncStorage.getItem(KEYS.DAILY_MESSAGE_DATE);
  return v ?? '';
}

async function setDailyMessageDate(date: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.DAILY_MESSAGE_DATE, date);
}

export async function getDailyMessageCount(): Promise<number> {
  const today = new Date().toDateString();
  const storedDate = await getDailyMessageDate();
  if (storedDate !== today) return 0;
  const v = await AsyncStorage.getItem(KEYS.DAILY_MESSAGE_COUNT);
  return v ? parseInt(v, 10) : 0;
}

export async function incrementDailyMessageCount(): Promise<number> {
  const today = new Date().toDateString();
  const storedDate = await getDailyMessageDate();
  let count = 0;
  if (storedDate === today) {
    const v = await AsyncStorage.getItem(KEYS.DAILY_MESSAGE_COUNT);
    count = v ? parseInt(v, 10) : 0;
  }
  count += 1;
  await AsyncStorage.setItem(KEYS.DAILY_MESSAGE_DATE, today);
  await AsyncStorage.setItem(KEYS.DAILY_MESSAGE_COUNT, String(count));
  return count;
}
