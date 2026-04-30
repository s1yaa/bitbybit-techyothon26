# 🌿 EcoBin

**AI-powered waste segregation in your pocket.** Scan. Sort. Save the planet. 🌍

EcoBin uses Google Gemini AI to identify waste items from your camera and classify them into municipal waste categories — Wet, Dry, Recyclable, Hazardous, and E-waste — then tells you exactly which bin to use.

## Features

- 📷 **AI Scanner** — Point your camera at any waste item for instant classification.
- 🎯 **Smart Results** — Confidence scores, disposal tips, and hands-free text-to-speech audio guidance.
- 📍 **Nearby Disposal Locator** — Interactive map showing nearby E-Waste, Battery, and Hazardous waste drop-off points based on your real-time GPS location.
- 🔔 **Smart Reminders** — Local, privacy-first push notifications scheduled automatically to remind you the night before your specific residential zone's collection days.
- 🏫 **Campus Impact** — View a real-time live feed of community sorting activity and track collective campus impact metrics.
- 📊 **Impact Dashboard** — Track your personal environmental impact: CO₂ saved, landfill diverted, and your overall recycling rate.
- 🏆 **Leaderboard** — Compete with the community on weekly & all-time eco-rankings.
- 🎮 **Gamification** — Earn XP, level up through 5 eco tiers, and unlock beautiful achievement badges.
- 🔥 **Streaks** — Build daily sorting habits with a visual weekly streak tracker.
- 👤 **Profile** — View your lifetime stats, manage account settings, and select your residential zone for smart reminders.

## Tech Stack

- **React Native** 0.81 + **Expo** SDK 54
- **Google Gemini 3.1 Flash Lite** (AI vision model)
- **Supabase** (Auth + PostgreSQL database)
- **Zustand** (Local state management & persistence)
- **React Native Reanimated** (Fluid, 60fps UI animations)
- **Expo Location & React Native Maps** (GPS-based locator)
- **Expo Notifications** (On-device scheduled reminders)

## Get Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

## Environment Variables

To run the app locally, create a `.env` file in the root directory with your keys:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
