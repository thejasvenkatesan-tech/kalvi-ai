# கல்வி.AI — Database Schema Reference

## Tables Overview

| Table                | Purpose                                      |
|----------------------|----------------------------------------------|
| schools              | School registry, CSR partner mapping         |
| teachers             | Teacher accounts, class assignments          |
| students             | Student profiles, XP, streaks                |
| modules              | AI literacy curriculum modules (1–7)         |
| missions             | 4 missions per module                        |
| mission_completions  | Which student completed which mission        |
| badges               | Badge definitions (bronze/silver/gold)       |
| student_badges       | Which student earned which badge             |
| chat_sessions        | Vidhu conversation history per student       |
| classroom_sessions   | Teacher-logged classroom sessions            |
| leaderboard_weekly   | School rankings updated weekly               |

## Key Design Decisions

### No email required
Students and teachers authenticate via phone OTP only.
Most village students have no email address.

### Roll number over personal data
Students are identified by school roll number, not personal phone.
DPDP Act compliant from day 1.

### Offline-first
mission_completions has an `offline` boolean flag.
Completions made offline queue locally and sync when connected.
Students never lose progress.

### JSON messages in chat_sessions
Conversation history stored as JSONB array:
[{ role: "user"|"assistant", content: "...", ts: "ISO date" }]
Keeps schema simple, allows full conversation replay.

### School code system
Each school gets a unique 6-digit code.
Teachers share this with students for onboarding.
No complex invitation system needed.

## Leaderboard Scoring Formula
points = (missions_completed × 10) + (badges_earned × 25) + (streak_days × 2)
Updated every Sunday night via a Supabase scheduled function.

## Supabase Setup Steps
1. Create new Supabase project (Mumbai region for India)
2. Go to SQL Editor
3. Paste and run packages/db/schema.sql
4. Enable Phone OTP in Authentication settings
5. Copy URL + anon key to .env
