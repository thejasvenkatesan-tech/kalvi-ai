# Kalvi.AI — CLAUDE.md

## Stack
- React Native (Expo SDK 57), EAS build, Android only
- Supabase: ekvlywtjqjhylhzyuoum.supabase.co
- Gemini proxy: kalvi-ai-dashboard.vercel.app/api/gemini
- Imagen proxy: kalvi-ai-dashboard.vercel.app/api/imagen

## Key files
- apps/mobile/src/screens/VidhuScreen.js — AI tutor chat
- apps/mobile/src/screens/OnboardingScreen.js — school search + login
- apps/mobile/src/utils/vidhu.js — Gemini API, prompts, mark schemes
- apps/mobile/src/utils/supabase.js — DB helpers
- apps/mobile/src/utils/config.js — GITIGNORED, local Gemini key

## Gemini model
Use: gemini-3.1-flash-lite (confirmed working Jul 2026)

## Demo account
School: KA8042 | Roll: 801 | PIN: 1234 | Name: தேர்வு | Class: 8

## EAS build
Package: com.kalviai.app
Command: TMPDIR=~/tmp/expo-cache eas build --platform android --profile preview
Free plan resets: Aug 1 2026

## Supabase tables
schools, students, saved_replies, topic_searches, diagram_library

## Known issues fixed
- Voice: 15s min, 5s silence (androidIntentOptions)
- No diagram for casual/greeting (reply.length < 150 or words < 3)
- Send disabled during diagram generation
- School search: max 4 results, type 2+ chars (searchSchools fn)
- visibleDocs pattern for filtered lists
