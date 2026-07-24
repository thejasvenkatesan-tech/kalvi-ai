import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

export default function HomeScreen({ student, questionsAsked, savedCount, setTab }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Welcome */}
        <View style={s.welcome}>
          <Text style={s.welcomeText}>வணக்கம், {student.name}! 👋</Text>
          <Text style={s.schoolText}>{student.school}</Text>
          <Text style={s.classText}>{student.cls}ஆம் வகுப்பு • Roll No: {student.roll}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statIcon}>💬</Text>
            <Text style={s.statValue}>{questionsAsked}</Text>
            <Text style={s.statLabel}>கேள்விகள்</Text>
            <Text style={s.statLabelEn}>Questions Asked</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statIcon}>🔖</Text>
            <Text style={s.statValue}>{savedCount}</Text>
            <Text style={s.statLabel}>சேமித்தவை</Text>
            <Text style={s.statLabelEn}>Saved Replies</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={s.sectionTitle}>என்ன செய்யலாம்?</Text>

        <TouchableOpacity style={s.actionCard} onPress={() => setTab("vidhu")}>
          <Text style={s.actionIcon}>🦉</Text>
          <View style={s.actionInfo}>
            <Text style={s.actionTitle}>விதுவிடம் கேள்</Text>
            <Text style={s.actionSub}>எந்த பாடமும் — தமிழில் விளக்கம் பெறு</Text>
          </View>
          <Text style={s.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionCard} onPress={() => setTab("saved")}>
          <Text style={s.actionIcon}>🔖</Text>
          <View style={s.actionInfo}>
            <Text style={s.actionTitle}>சேமித்த பதில்கள்</Text>
            <Text style={s.actionSub}>மீண்டும் படிக்க சேமித்த விளக்கங்கள்</Text>
          </View>
          <Text style={s.actionArrow}>→</Text>
        </TouchableOpacity>

        {/* Subjects */}
        <Text style={s.sectionTitle}>விதுவிடம் கேட்கலாம்</Text>
        <View style={s.subjectsGrid}>
          {[
            { icon: "🔬", subject: "அறிவியல்",      en: "Science"  },
            { icon: "📐", subject: "கணிதம்",         en: "Maths"    },
            { icon: "📖", subject: "தமிழ்",           en: "Tamil"    },
            { icon: "🌍", subject: "சமூக அறிவியல்", en: "Social"   },
            { icon: "🔤", subject: "ஆங்கிலம்",       en: "English"  },
            { icon: "🤖", subject: "AI",              en: "AI"       },
          ].map(sub => (
            <TouchableOpacity
              key={sub.subject}
              style={s.subjectCard}
              onPress={() => setTab("vidhu")}>
              <Text style={s.subjectIcon}>{sub.icon}</Text>
              <Text style={s.subjectName}>{sub.subject}</Text>
              <Text style={s.subjectEn}>{sub.en}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info card */}
        <View style={s.infoCard}>
          <Text style={s.infoText}>
            💡 விதுவிடம் கேட்ட கேள்விகள் உன் ஆசிரியருக்கு தெரியும் — அவர் வகுப்பில் மேலும் விளக்குவார்!
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.cream },
  scroll:        { padding: spacing.lg, paddingBottom: spacing.xxxl },
  welcome:       { backgroundColor: colors.blue, borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.lg },
  welcomeText:   { fontSize: fontSizes.xl, fontWeight: "800", color: colors.white, marginBottom: 4 },
  schoolText:    { fontSize: fontSizes.sm, color: "rgba(255,255,255,0.7)", marginBottom: 2 },
  classText:     { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.5)" },
  statsRow:      { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  statCard:      { flex: 1, backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  statIcon:      { fontSize: 28, marginBottom: spacing.sm },
  statValue:     { fontSize: fontSizes.hero, fontWeight: "800", color: colors.blue },
  statLabel:     { fontSize: fontSizes.sm, fontWeight: "600", color: colors.ink, marginTop: 4 },
  statLabelEn:   { fontSize: fontSizes.xs, color: colors.muted },
  sectionTitle:  { fontSize: fontSizes.base, fontWeight: "700", color: colors.muted, marginBottom: spacing.md, textTransform: "uppercase", letterSpacing: 0.5 },
  actionCard:    { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  actionIcon:    { fontSize: 32 },
  actionInfo:    { flex: 1 },
  actionTitle:   { fontSize: fontSizes.md, fontWeight: "700", color: colors.ink },
  actionSub:     { fontSize: fontSizes.sm, color: colors.muted, marginTop: 2 },
  actionArrow:   { fontSize: fontSizes.lg, color: colors.muted },
  subjectsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.lg },
  subjectCard:   { width: "30%", backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  subjectIcon:   { fontSize: 28, marginBottom: 6 },
  subjectName:   { fontSize: fontSizes.sm, fontWeight: "600", color: colors.ink, textAlign: "center" },
  subjectEn:     { fontSize: fontSizes.xs, color: colors.muted, textAlign: "center" },
  infoCard:      { backgroundColor: colors.blueLight, borderRadius: radii.lg, padding: spacing.md },
  infoText:      { fontSize: fontSizes.sm, color: colors.blue, lineHeight: 20 },
});
