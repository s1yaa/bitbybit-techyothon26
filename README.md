# 🌿 EcoBin

**AI-powered waste segregation in your pocket.** Scan. Sort. Save the planet. 🌍

EcoBin uses Google Gemini AI to identify waste items from your camera and classify them into 5 Indian municipal waste categories — Wet, Dry, Recyclable, Hazardous, and E-waste — then tells you exactly which bin to use.

## Features

- 📷 **AI Scanner** — Point your camera at any waste item for instant classification
- 🎯 **Smart Results** — Confidence scores, disposal tips, and text-to-speech guidance
- 📊 **Impact Dashboard** — Track CO₂ saved, landfill diverted, and recycling rates
- 🏆 **Leaderboard** — Compete with the community on weekly & all-time rankings
- 🎮 **Gamification** — Earn XP, level up through 5 eco tiers, and unlock 7 badges
- 🔥 **Streaks** — Daily sorting streak tracking with weekly view
- 👤 **Profile** — Stats, badges, and account settings

## Tech Stack

- **React Native** 0.81 + **Expo** SDK 54
- **Google Gemini 3.1 Flash Lite** (vision model)
- **Supabase** (auth + database)
- **Zustand** (state management)
- **React Native Reanimated** (animations)

## Get Started

```bash
npm install
npx expo start
```

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
