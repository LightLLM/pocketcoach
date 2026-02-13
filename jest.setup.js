// Global mocks for React Native / Expo in Node
const storage = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(storage[key] ?? null)),
  setItem: jest.fn((key, value) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete storage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
    return Promise.resolve();
  }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      EXPO_PUBLIC_AI_MODE: 'mock',
      EXPO_PUBLIC_OPENAI_API_KEY: undefined,
    },
  },
}));

jest.mock('react-native-purchases', () => ({
  Purchases: {
    configure: jest.fn(() => Promise.resolve()),
    getCustomerInfo: jest.fn(() =>
      Promise.resolve({
        entitlements: { active: {} },
      })
    ),
    getOfferings: jest.fn(() => Promise.resolve({ current: null })),
    restorePurchases: jest.fn(() =>
      Promise.resolve({
        entitlements: { active: {} },
      })
    ),
    purchasePackage: jest.fn(() => Promise.reject(new Error('mock'))),
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Warning: 'warning' },
}));

// Reset storage between tests that need a clean slate
beforeEach(() => {
  Object.keys(storage).forEach((k) => delete storage[k]);
});
