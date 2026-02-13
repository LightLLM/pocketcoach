import {
  getOnboardingDone,
  setOnboardingDone,
  getUserProfile,
  setUserProfile,
  getCustomCoaches,
  setCustomCoaches,
  getChatSessions,
  setChatSessions,
  getDailyMessageCount,
  incrementDailyMessageCount,
} from '../storage';

describe('storage', () => {
  describe('onboarding', () => {
    it('returns false when not set', async () => {
      expect(await getOnboardingDone()).toBe(false);
    });

    it('returns true after setOnboardingDone(true)', async () => {
      await setOnboardingDone(true);
      expect(await getOnboardingDone()).toBe(true);
    });

    it('returns false after setOnboardingDone(false)', async () => {
      await setOnboardingDone(true);
      await setOnboardingDone(false);
      expect(await getOnboardingDone()).toBe(false);
    });
  });

  describe('user profile', () => {
    it('returns null when not set', async () => {
      expect(await getUserProfile()).toBeNull();
    });

    it('round-trips profile', async () => {
      const profile = { values: 'honesty', goals: 'ship fast', constraints: 'no backend' };
      await setUserProfile(profile);
      const got = await getUserProfile();
      expect(got?.values).toBe('honesty');
      expect(got?.goals).toBe('ship fast');
      expect(got?.constraints).toBe('no backend');
      expect(got?.updatedAt).toBeDefined();
      expect(typeof got?.updatedAt).toBe('number');
    });

    it('returns null for invalid JSON', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('not valid json {');
      expect(await getUserProfile()).toBeNull();
    });
  });

  describe('custom coaches', () => {
    it('returns empty array when not set', async () => {
      expect(await getCustomCoaches()).toEqual([]);
    });

    it('round-trips coaches', async () => {
      const coaches = [
        {
          id: 'c1',
          name: 'Test',
          tagline: 'Tag',
          longDescription: 'Desc',
          styleRules: [],
          starterPrompts: [],
          category: 'habits' as const,
          isPro: false,
        },
      ];
      await setCustomCoaches(coaches);
      expect(await getCustomCoaches()).toHaveLength(1);
      expect((await getCustomCoaches())[0].name).toBe('Test');
    });
  });

  describe('chat sessions', () => {
    it('returns empty object when not set', async () => {
      expect(await getChatSessions()).toEqual({});
    });

    it('round-trips sessions', async () => {
      const sessions = {
        coach1: {
          coachId: 'coach1',
          messages: [
            { id: 'm1', role: 'user' as const, content: 'hi', timestamp: 1 },
          ],
          updatedAt: 1,
        },
      };
      await setChatSessions(sessions);
      const got = await getChatSessions();
      expect(Object.keys(got)).toContain('coach1');
      expect(got.coach1.messages).toHaveLength(1);
      expect(got.coach1.messages[0].content).toBe('hi');
    });
  });

  describe('daily message count', () => {
    it('returns 0 when no date stored', async () => {
      expect(await getDailyMessageCount()).toBe(0);
    });

    it('increments and returns count', async () => {
      const c1 = await incrementDailyMessageCount();
      expect(c1).toBe(1);
      expect(await getDailyMessageCount()).toBe(1);
      const c2 = await incrementDailyMessageCount();
      expect(c2).toBe(2);
      expect(await getDailyMessageCount()).toBe(2);
    });
  });
});
