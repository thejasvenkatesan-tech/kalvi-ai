// ─────────────────────────────────────────────
// கல்வி.AI — Design Tokens
// Single source of truth for all apps
// ─────────────────────────────────────────────

const colors = {
  // Brand
  blue:         "#1B3A6B",  // Primary — knowledge, sky, trust
  blueLight:    "#E6EEF8",  // Blue tint backgrounds
  gold:         "#E8A020",  // Accent — warmth, Tamil identity
  goldLight:    "#FDF3E0",  // Gold tint backgrounds
  terra:        "#C45C3A",  // Earth, roots, Dravidian warmth
  terraLight:   "#FAEAE4",  // Terra tint backgrounds

  // Neutral
  cream:        "#F7F3ED",  // App background
  white:        "#FFFFFF",
  ink:          "#1A1612",  // Primary text
  muted:        "#6B6560",  // Secondary text
  border:       "#E2DDD7",  // Borders, dividers

  // Semantic
  success:      "#2D7A5F",
  successLight: "#E1F0E9",
  warning:      "#E8A020",
  error:        "#C45C3A",
};

const fonts = {
  tamil:   "'Noto Sans Tamil', sans-serif",  // All Tamil text
  english: "'Nunito', sans-serif",           // English headings
  mono:    "'Fira Code', monospace",         // Code snippets
};

const fontSizes = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   15,
  lg:   18,
  xl:   20,
  xxl:  24,
  hero: 32,
};

const fontWeights = {
  regular: "400",
  medium:  "600",
  bold:    "700",
  black:   "800",
};

const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl:32,
};

const radii = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 999,
};

const shadows = {
  sm: "0 1px 4px rgba(0,0,0,0.06)",
  md: "0 4px 12px rgba(0,0,0,0.08)",
  lg: "0 8px 24px rgba(0,0,0,0.10)",
};

module.exports = { colors, fonts, fontSizes, fontWeights, spacing, radii, shadows };
