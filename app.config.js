export default ({ config }) => ({
  ...config,
  extra: {
    EXPO_PUBLIC_RC_IOS_API_KEY: process.env.EXPO_PUBLIC_RC_IOS_API_KEY,
    EXPO_PUBLIC_RC_ANDROID_API_KEY: process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY,
    EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    EXPO_PUBLIC_AI_MODE: process.env.EXPO_PUBLIC_AI_MODE ?? 'mock',
  },
});
