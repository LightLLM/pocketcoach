# Assets

Add the following files for the app to build with a custom icon and splash:

- **icon.png** — 1024×1024 px, app icon
- **splash-icon.png** — recommended 1284×2778 px, splash screen
- **adaptive-icon.png** — 1024×1024 px, Android adaptive icon foreground

If these are missing, you may see asset resolution errors. To get default Expo assets:

```bash
npx create-expo-app@latest _temp --template blank-typescript
cp _temp/assets/* ./
rm -rf _temp
```
