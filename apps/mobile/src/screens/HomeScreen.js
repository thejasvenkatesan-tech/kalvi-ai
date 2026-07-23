import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

const MISSIONS = [
  { id: 1, title: "AI என்ன செய்கிறது?", icon: "🤖", xp: 20, done: false, week: 1 },
  { id: 2, title: "வீட்டில் AI கண்டுபிடி", icon: "🔍", xp: 30, done: false, week: 2 },
  { id: 3, title: "AI தவறாக சொல்லும்!", icon: "🧐", xp: 40, done: false, week: 3 },
  { id: 4, title: "குடும்பத்திற்கு சொல்லு", icon: "👨‍👩‍👧", xp: 50, done: false, week: 4 },
];

export default function HomeScreen({ user, missions = MISSIONS, badges = [], streak = 3, onMissionLaunch, setTab }) {
  const totalXP    = missions.filter(m => m.done).reduce((a, m) => a + m.xp, 0);
  const nextMission = missions.find(m => !m.done);
  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>வணக்கம்,</Text>
            <Text style={s.name}>{user?.name || "மாணவர்"} 👋</Text>
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakText}>🔥 {streak} நாள்</Text>
          </View>
        </View>

        {/* XP Card */}
        <View style={s.xpCard}>
          <Text style={s.xpLabel}>மொத்த XP புள்ளிகள்</Text>
          <Text style={s.xpValue}>{totalXP} <Text style={s.xpMax}>/ 140 XP</Text></Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${Math.min(100, (totalXP / 140) * 100)}%` }]} />
          </View>
          <Text style={s.xpHint}>Bronze badge-க்கு {140 - totalXP} XP தேவை</Text>
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
          {[
            { label: "பணிகள்",  value: `${missions.filter(m=>m.done).length}/${missions.length}`, icon: "🎯" },
            { label: "பட்ஜ்கள்", value: `${earnedBadges}/${badges.length || 4}`,                  icon: "🏅" },
            { label: "வகுப்பு",  value: `${user?.cls || "7"}ஆம்`,                                  icon: "📚" },
          ].map(stat => (
            <View key={stat.label} style={s.statCard}>
              <Text style={s.statIcon}>{stat.icon}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Next Mission */}
        {nextMission && (
          <View style={s.missionCard}>
            <Text style={s.missionEyebrow}>இன்றைய பணி</Text>
            <View style={s.missionRow}>
              <Text style={s.missionIcon}>{nextMission.icon}</Text>
              <View style={s.missionInfo}>
                <Text style={s.missionTitle}>{nextMission.title}</Text>
                <Text style={s.missionXP}>+{nextMission.xp} XP • வாரம் {nextMission.week}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.missionBtn} onPress={() => onMissionLaunch?.(nextMission)}>
              <Text style={s.missionBtnText}>விதுவிடம் கேள் →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* School Card */}
        <View style={s.schoolCard}>
          <Text style={s.schoolIcon}>🏫</Text>
          <View style={s.schoolInfo}>
            <Text style={s.schoolName}>{user?.school || "உன் பள்ளி"}</Text>
            <Text style={s.schoolRank}>மாவட்ட தரவரிசை: #4 <Text style={{ color: colors.terra }}>↑ 1</Text></Text>
          </View>
        </View>

        {/* Module Info */}
        <View style={s.moduleCard}>
          <Text style={s.moduleLabel}>Module 1</Text>
          <Text style={s.moduleTitle}>AI என்றால் என்ன?</Text>
          <Text style={s.moduleDesc}>4 பணிகள் • 4 வாரங்கள் • Bronze Certificate</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.cream },
  scroll:         { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  greeting:       { fontSize: fontSizes.sm, color: colors.muted },
  name:           { fontSize: fontSizes.xl, fontWeight: "800", color: colors.blue },
  streakBadge:    { backgroundColor: colors.terraLight, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  streakText:     { fontSize: fontSizes.sm, color: colors.terra, fontWeight: "700" },
  xpCard:         { backgroundColor: colors.blue, borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.md },
  xpLabel:        { fontSize: fontSizes.sm, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  xpValue:        { fontSize: fontSizes.hero, fontWeight: "800", color: colors.white },
  xpMax:          { fontSize: fontSizes.base, fontWeight: "400", opacity: 0.6 },
  progressBg:     { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: radii.full, height: 8, marginTop: spacing.sm },
  progressFill:   { backgroundColor: colors.gold, height: "100%", borderRadius: radii.full },
  xpHint:         { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.6)", marginTop: 6 },
  statsRow:       { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statCard:       { flex: 1, backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  statIcon:       { fontSize: 20, marginBottom: 4 },
  statValue:      { fontSize: fontSizes.lg, fontWeight: "700", color: colors.ink },
  statLabel:      { fontSize: fontSizes.xs, color: colors.muted, marginTop: 2 },
  missionCard:    { backgroundColor: colors.goldLight, borderRadius: radii.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.gold },
  missionEyebrow: { fontSize: fontSizes.xs, color: colors.gold, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.sm },
  missionRow:     { flexDirection: "row", gap: spacing.md, alignItems: "center", marginBottom: spacing.md },
  missionIcon:    { fontSize: 32 },
  missionInfo:    { flex: 1 },
  missionTitle:   { fontSize: fontSizes.md, fontWeight: "700", color: colors.ink },
  missionXP:      { fontSize: fontSizes.sm, color: colors.muted, marginTop: 3 },
  missionBtn:     { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.md, alignItems: "center" },
  missionBtnText: { color: colors.white, fontWeight: "700", fontSize: fontSizes.base },
  schoolCard:     { backgroundColor: colors.blueLight, borderRadius: radii.lg, padding: spacing.md, flexDirection: "row", gap: spacing.md, alignItems: "center", marginBottom: spacing.md },
  schoolIcon:     { fontSize: 28 },
  schoolInfo:     { flex: 1 },
  schoolName:     { fontSize: fontSizes.base, fontWeight: "600", color: colors.blue },
  schoolRank:     { fontSize: fontSizes.sm, color: colors.muted, marginTop: 2 },
  moduleCard:     { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  moduleLabel:    { fontSize: fontSizes.xs, color: colors.gold, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  moduleTitle:    { fontSize: fontSizes.lg, fontWeight: "700", color: colors.ink },
  moduleDesc:     { fontSize: fontSizes.sm, color: colors.muted, marginTop: 4 },
});
