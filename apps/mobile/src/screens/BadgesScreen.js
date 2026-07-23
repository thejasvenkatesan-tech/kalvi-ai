import {
  View, Text, ScrollView, StyleSheet, SafeAreaView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

export default function BadgesScreen({ badges }) {
  const earned = badges.filter(b => b.earned).length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>என் பட்ஜ்கள்</Text>
        <Text style={s.sub}>{earned} / {badges.length} சம்பாதித்தாய்</Text>

        <View style={s.grid}>
          {badges.map(b => (
            <View key={b.id} style={[s.card, b.earned && s.cardEarned]}>
              <Text style={[s.icon, !b.earned && s.iconGray]}>{b.icon}</Text>
              <Text style={[s.name, !b.earned && s.nameMuted]}>{b.name_ta}</Text>
              <Text style={s.nameEn}>{b.name_en}</Text>
              {b.earned
                ? <View style={s.earnedTag}><Text style={s.earnedText}>✓ கிடைத்தது</Text></View>
                : <View style={s.lockedTag}><Text style={s.lockedText}>🔒 பூட்டு</Text></View>
              }
            </View>
          ))}
        </View>

        <View style={s.progressCard}>
          <Text style={s.progressTitle}>🥉 Bronze Certificate நோக்கி</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${(earned / badges.length) * 100}%` }]} />
          </View>
          <Text style={s.progressHint}>
            {badges.length - earned} பட்ஜ் மேலும் தேவை — அனைத்தையும் சம்பாதி!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.cream },
  scroll:       { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title:        { fontSize: fontSizes.xl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  sub:          { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.lg },
  grid:         { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card:         { width: "47%", backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing.lg, alignItems: "center", borderWidth: 1.5, borderColor: colors.border },
  cardEarned:   { borderColor: colors.gold, backgroundColor: colors.goldLight },
  icon:         { fontSize: 36, marginBottom: spacing.sm },
  iconGray:     { opacity: 0.3 },
  name:         { fontSize: fontSizes.base, fontWeight: "700", color: colors.ink, textAlign: "center" },
  nameMuted:    { color: colors.muted },
  nameEn:       { fontSize: fontSizes.xs, color: colors.muted, marginTop: 2, textAlign: "center" },
  earnedTag:    { marginTop: spacing.sm, backgroundColor: colors.gold, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: 3 },
  earnedText:   { fontSize: fontSizes.xs, color: colors.white, fontWeight: "700" },
  lockedTag:    { marginTop: spacing.sm, backgroundColor: colors.border, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: 3 },
  lockedText:   { fontSize: fontSizes.xs, color: colors.muted },
  progressCard: { backgroundColor: colors.blueLight, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md },
  progressTitle:{ fontSize: fontSizes.md, fontWeight: "700", color: colors.blue, marginBottom: spacing.md },
  progressBg:   { backgroundColor: colors.border, borderRadius: radii.full, height: 8, marginBottom: spacing.sm },
  progressFill: { backgroundColor: colors.gold, height: "100%", borderRadius: radii.full },
  progressHint: { fontSize: fontSizes.sm, color: colors.muted },
});
