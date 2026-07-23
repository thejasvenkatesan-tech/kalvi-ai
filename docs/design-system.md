# கல்வி.AI — Design System

## Colours

| Token         | Hex       | Usage                              |
|---------------|-----------|------------------------------------|
| blue          | #1B3A6B   | Primary — buttons, headers, nav    |
| blueLight     | #E6EEF8   | Blue tint backgrounds              |
| gold          | #E8A020   | Accent — badges, XP, highlights    |
| goldLight     | #FDF3E0   | Gold tint backgrounds              |
| terra         | #C45C3A   | Streaks, alerts, Dravidian warmth  |
| terraLight    | #FAEAE4   | Terra tint backgrounds             |
| cream         | #F7F3ED   | App background                     |
| white         | #FFFFFF   | Cards, surfaces                    |
| ink           | #1A1612   | Primary text                       |
| muted         | #6B6560   | Secondary text, placeholders       |
| border        | #E2DDD7   | Borders, dividers                  |
| success       | #2D7A5F   | Completed states, positive         |
| successLight  | #E1F0E9   | Success tint backgrounds           |

## Typography

| Font              | Usage                        | Source                  |
|-------------------|------------------------------|-------------------------|
| Noto Sans Tamil   | All Tamil text, UI body      | Google Fonts            |
| Nunito            | English headings             | Google Fonts            |
| Fira Code         | Code snippets (future)       | Google Fonts            |

## Font Sizes
xs=11, sm=12, base=14, md=15, lg=18, xl=20, xxl=24, hero=32

## Font Weights
regular=400, medium=600, bold=700, black=800

## Spacing Scale (px)
xs=4, sm=8, md=12, lg=16, xl=20, xxl=24, xxxl=32

## Border Radius
sm=8, md=12, lg=16, xl=20, full=999

## Component Rules
- All buttons: no border-radius less than 8px
- Primary CTA: blue background, white text, bold 700
- Cards: white background, 1px border (#E2DDD7), radius 14–16px
- Tamil text always uses Noto Sans Tamil
- Never use pure black (#000) — use ink (#1A1612)
- Offline indicator: always show clearly, never hide connectivity state

## Vidhu (Owl Mascot)
- Always appears with goldLight (#FDF3E0) background circle
- Gold (#E8A020) body
- Never use Vidhu for error states — keep her warm and positive
- Minimum size: 28px, Maximum size: 64px in UI

## Voice & Tone
- Tamil first, always
- Celebrate small wins loudly
- Never condescending
- Code-switch English terms naturally:
  "இதை ஆங்கிலத்தில் '[TERM]' என்று சொல்வார்கள்"
