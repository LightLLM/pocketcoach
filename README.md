# Pocket Coach

Minimalist AI coaching in your pocket — Shipyard Creator Contest MVP.

## Quick start

```bash
# Install dependencies
npm install

# Copy env and set AI mode (optional; mock works without keys)
cp .env.example .env
# Edit .env: EXPO_PUBLIC_AI_MODE=mock (default) or real + EXPO_PUBLIC_OPENAI_API_KEY

# Start the app
npx expo start
```

## Tests

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch
```

Tests cover: `lib/` (storage, aiClient, analytics, entitlements, revenueCat), `data/coaches`, `context/AppContext`, and `components/` (Button, Card, Text, Chip, ErrorBoundary). AsyncStorage, RevenueCat, and Expo modules are mocked in `jest.setup.js`.

Then press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

## Assets

If you see asset resolution errors, add these to `assets/`:

- `icon.png` (1024×1024) — app icon
- `splash-icon.png` — splash screen image
- `adaptive-icon.png` (1024×1024) — Android adaptive icon

You can copy them from a fresh Expo app: `npx create-expo-app@latest temp --template blank-typescript` then copy `temp/assets/*` into `assets/`.

## Environment (.env)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_RC_IOS_API_KEY` | RevenueCat iOS API key (optional for demo) |
| `EXPO_PUBLIC_RC_ANDROID_API_KEY` | RevenueCat Android API key (optional for demo) |
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key for real AI mode |
| `EXPO_PUBLIC_AI_MODE` | `mock` (default) or `real` |

With `EXPO_PUBLIC_AI_MODE=mock` and no keys, the app runs fully with canned coaching replies.

## Demo flow

1. **Onboarding** → 2 screens, then Get started
2. **Home** → Browse coaches, search, filter by category
3. **Coach detail** → Read description, tap "Start chat" (or "Unlock with Pro" for Pro coaches)
4. **Chat** → Send messages; quick prompts: Summarize, Next step, etc.
5. **Paywall** → Triggered by selecting a Pro coach or exceeding 3 free chats/day. Restore purchases + purchase flow (RevenueCat).
6. **Profile** → Values, goals, constraints (used to personalize AI)
7. **Settings** → Restore purchases, Terms, Privacy
8. **Create coach** → Name, tone, purpose, rules → appears in library

## Tech

- **React Native + Expo** (SDK 52), TypeScript
- **Expo Router** for file-based navigation
- **RevenueCat** (`react-native-purchases`) for Pro subscription
- **AsyncStorage** for profile, custom coaches, chat history
- **AI**: `lib/aiClient.ts` — mock (canned replies) or real (OpenAI chat completions)

## Project structure

```
app/
  _layout.tsx        # Root layout, RevenueCat init, ErrorBoundary
  index.tsx          # Splash / redirect to onboarding or (tabs)
  onboarding.tsx     # 2-screen onboarding
  (tabs)/
    _layout.tsx      # Tab bar: Coaches, Profile, Settings
    index.tsx        # Home — coach library
    profile.tsx      # User context (values, goals, constraints)
    settings.tsx     # Restore, Terms, Privacy
  coach/
    [id].tsx         # Coach detail + Start chat / Share
    create.tsx       # Create custom coach form
  chat/
    [coachId].tsx    # Chat UI + quick prompts
  paywall.tsx        # RevenueCat offerings, purchase, restore
components/          # Button, Card, Text, Chip, ErrorBoundary
context/AppContext.tsx
lib/
  aiClient.ts        # Mock + real OpenAI
  analytics.ts      # Demo analytics (console)
  entitlements.ts    # RevenueCat "pro" check
  revenueCat.ts     # Configure Purchases
  storage.ts        # AsyncStorage helpers
data/coaches.ts     # 8 seeded coaches
types/coach.ts
constants/
```

## RevenueCat setup

1. Create a project in [RevenueCat](https://www.revenuecat.com).
2. Add your app (iOS/Android), link App Store Connect / Play Console.
3. Create an entitlement `pro` and attach your subscription products.
4. Create an offering (e.g. default) with packages (monthly, annual).
5. Put the API keys in `.env` as `EXPO_PUBLIC_RC_IOS_API_KEY` and `EXPO_PUBLIC_RC_ANDROID_API_KEY`.

Without keys, the app runs; paywall shows "No subscription packages available".

## License

MIT.
