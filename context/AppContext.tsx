import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import type { Coach, UserProfile, ChatSession } from '@/types/coach';
import * as storage from '@/lib/storage';
import { isProUser } from '@/lib/entitlements';
import { SEEDED_COACHES } from '@/data/coaches';

const FREE_DAILY_MESSAGES = 3;

type AppState = {
  onboardingDone: boolean | null;
  userProfile: UserProfile | null;
  customCoaches: Coach[];
  chatSessions: Record<string, ChatSession>;
  isPro: boolean;
  dailyMessageCount: number;
  isLoading: boolean;
};

type AppContextValue = AppState & {
  setOnboardingDone: (done: boolean) => Promise<void>;
  setUserProfile: (profile: UserProfile) => Promise<void>;
  addCustomCoach: (coach: Coach) => Promise<void>;
  updateChatSession: (coachId: string, session: ChatSession) => Promise<void>;
  refreshPro: () => Promise<void>;
  refreshDailyCount: () => Promise<void>;
  incrementDailyMessageCount: () => Promise<number>;
  canSendMessage: () => boolean;
  allCoaches: Coach[];
};

const defaultState: AppState = {
  onboardingDone: null,
  userProfile: null,
  customCoaches: [],
  chatSessions: {},
  isPro: false,
  dailyMessageCount: 0,
  isLoading: true,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const load = useCallback(async () => {
    try {
      const [onboardingDone, userProfile, customCoaches, chatSessions, dailyMessageCount, isPro] =
        await Promise.all([
          storage.getOnboardingDone(),
          storage.getUserProfile(),
          storage.getCustomCoaches(),
          storage.getChatSessions(),
          storage.getDailyMessageCount(),
          isProUser(),
        ]);
      setState((s) => ({
        ...s,
        onboardingDone,
        userProfile,
        customCoaches,
        chatSessions,
        dailyMessageCount,
        isPro,
        isLoading: false,
      }));
    } catch (e) {
      console.warn('AppContext load failed', e);
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setOnboardingDone = useCallback(async (done: boolean) => {
    await storage.setOnboardingDone(done);
    setState((s) => ({ ...s, onboardingDone: done }));
  }, []);

  const setUserProfile = useCallback(async (profile: UserProfile) => {
    await storage.setUserProfile(profile);
    setState((s) => ({ ...s, userProfile: profile }));
  }, []);

  const addCustomCoach = useCallback(async (coach: Coach) => {
    const next = [...state.customCoaches, { ...coach, isCustom: true }];
    await storage.setCustomCoaches(next);
    setState((s) => ({ ...s, customCoaches: next }));
  }, [state.customCoaches]);

  const updateChatSession = useCallback(async (coachId: string, session: ChatSession) => {
    const next = { ...state.chatSessions, [coachId]: session };
    await storage.setChatSessions(next);
    setState((s) => ({ ...s, chatSessions: next }));
  }, [state.chatSessions]);

  const refreshPro = useCallback(async () => {
    const pro = await isProUser();
    setState((s) => ({ ...s, isPro: pro }));
  }, []);

  const refreshDailyCount = useCallback(async () => {
    const count = await storage.getDailyMessageCount();
    setState((s) => ({ ...s, dailyMessageCount: count }));
  }, []);

  const incrementDailyMessageCount = useCallback(async () => {
    const count = await storage.incrementDailyMessageCount();
    setState((s) => ({ ...s, dailyMessageCount: count }));
    return count;
  }, []);

  const canSendMessage = useCallback(() => {
    if (state.isPro) return true;
    return state.dailyMessageCount < FREE_DAILY_MESSAGES;
  }, [state.isPro, state.dailyMessageCount]);

  const allCoaches = [...SEEDED_COACHES, ...state.customCoaches];

  const value: AppContextValue = {
    ...state,
    setOnboardingDone,
    setUserProfile,
    addCustomCoach,
    updateChatSession,
    refreshPro,
    refreshDailyCount,
    incrementDailyMessageCount,
    canSendMessage,
    allCoaches,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
