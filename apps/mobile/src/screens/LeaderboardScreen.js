import {
  View, Text, ScrollView, StyleSheet, SafeAreaView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

const LEADERBOARD = [
  { rank: 1, school: "ஒன்றியம் நடுநிலை பள்ளி, வேலூர்",   points: 1240, badges: 18 },
  { rank: 2, school: "அரசு உயர்நிலை பள்ளி, தர்மபுரி",     points: 1180, badges: 15 },
  { rank: 3, school: "அரசு மேல்நிலை பள்ளி, விருதுநகர்",   points: 1050, badges: 13 },
  { rank: 4, school: "உன் பள்ளி",                           points: 320,  badges: 4, isUser: true },
  { rank: 5, school: "அரசு மேல்நிலை பள்ளி, நாமக்கல்",     points: 290,  badges: 3 },
];

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>மாவட்ட தரவரிசை</Text>
        <Text style={s.sub}>இந்த வாரம் — தர்மபுரி மாவட்டம்</Text>

        {LEADERBOARD.map(l => (
          <View key={l.rank} style={[s.row, l.isUser && s.rowUser]}>
            <Text style={s.medal}>{MEDAL[l.rank - 1] || l.rank}</Text>
            <View style={s.info}>
              <Text style={[s.school, l.isUser && s.schoolUser]} numberOfLines={1}>{l.school}</Text>
              <Text style={s.badges}>{l.badges} பட்ஜ்கள்</Text>
            </View>
            <Text style={[s.points, l.isUser && s.pointsUser]}>{l.points}</Text>
          </View>
        ))}

        <View style={s.tip}>
          <Text style={s.tipText}>
            💡 மேலும் பணிகள் முடித்தால் உன் பள்ளியின் தரம் உயரும்!
            இந்த வாரம் #3-க்கு போகலாம்.
          </Text>
        </View>

        <View style={s.howCard}>
          <Text style={s.howTitle}>புள்ளிகள் எப்படி கணக்கிடுவார்கள்?</Text>
          {[
            { label: "ஒவ்வொரு பணி முடிந்தால்", pts: "+10" },
            { label: "ஒவ்வொரு பட்ஜ் கிடைத்தால்", pts: "+25" },
            { label: "தினமும் streak",             pts: "+2"  },
          ].map(h => (
            <View key={h.label} style={s.howRow}>
              <Text style={s.howLabel}>{h.label}</Text>
              <Text style={s.howPts}>{h.pts}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.cream },
  scroll:     { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title:      { fontSize: fontSizes.xl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  sub:        { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.lg },
  row:        { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1.5, borderColor: colors.border },
  rowUser:    { backgroundColor: colors.blueLight, borderColor: colors.blue },
  medal:      { fontSize: 24, minWidth: 32, textAlign: "center" },
  info:       { flex: 1 },
  school:     { fontSize: fontSizes.base, fontWeight: "500", color: colors.ink },
  schoolUser: { fontWeight: "700", color: colors.blue },
  badges:     { fontSize: fontSizes.xs, color: colors.muted, marginTop: 2 },
  points:     { fontSize: fontSizes.lg, fontWeight: "800", color: colors.muted },
  pointsUser: { color: colors.blue },
  tip:        { backgroundColor: colors.successLight, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.sm },
  tipText:    { fontSize: fontSizes.sm, color: colors.success, lineHeight: 20 },
  howCard:    { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border },
  howTitle:   { fontSize: fontSizes.base, fontWeight: "700", color: colors.ink, marginBottom: spacing.md },
  howRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  howLabel:   { fontSize: fontSizes.sm, color: colors.muted },
  howPts:     { fontSize: fontSizes.sm, fontWeight: "700", color: colors.gold },
});
