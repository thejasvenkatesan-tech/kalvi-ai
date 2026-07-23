import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

export default function MissionsScreen({ missions, onLaunch }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Module 1 பணிகள்</Text>
        <Text style={s.sub}>AI என்றால் என்ன? — 4 வாரம்</Text>

        {missions.map((m, i) => {
          const locked = i > 0 && !missions[i - 1].done;
          return (
            <View key={m.id} style={[s.card, m.done && s.cardDone, locked && s.cardLocked]}>
              <View style={s.row}>
                <Text style={s.icon}>{m.done ? "✅" : m.icon}</Text>
                <View style={s.info}>
                  <View style={s.topRow}>
                    <Text style={[s.mTitle, m.done && s.mTitleDone]}>{m.title}</Text>
                    <Text style={s.xp}>+{m.xp} XP</Text>
                  </View>
                  <Text style={s.desc}>{m.desc}</Text>
                  <Text style={s.week}>வாரம் {m.week}</Text>
                </View>
              </View>

              {!m.done && !locked && (
                <TouchableOpacity style={s.btn} onPress={() => onLaunch?.(m)}>
                  <Text style={s.btnText}>தொடங்கு →</Text>
                </TouchableOpacity>
              )}
              {locked && (
                <Text style={s.lockText}>🔒 முந்தைய பணியை முடி</Text>
              )}
            </View>
          );
        })}

        <View style={s.certCard}>
          <Text style={s.certIcon}>🥉</Text>
          <View style={s.certInfo}>
            <Text style={s.certTitle}>Bronze Certificate</Text>
            <Text style={s.certDesc}>அனைத்து 4 பணிகளையும் முடித்தால் "AI அறிவாளி" certificate கிடைக்கும்!</Text>
          </View>
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
  card:       { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.border },
  cardDone:   { borderColor: colors.success, backgroundColor: colors.successLight },
  cardLocked: { opacity: 0.5 },
  row:        { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", marginBottom: spacing.sm },
  icon:       { fontSize: 32 },
  info:       { flex: 1 },
  topRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mTitle:     { fontSize: fontSizes.md, fontWeight: "700", color: colors.ink, flex: 1 },
  mTitleDone: { color: colors.success },
  xp:         { fontSize: fontSizes.sm, fontWeight: "600", color: colors.gold },
  desc:       { fontSize: fontSizes.sm, color: colors.muted, marginTop: 3 },
  week:       { fontSize: fontSizes.xs, color: colors.muted, marginTop: 4 },
  btn:        { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.md, alignItems: "center" },
  btnText:    { color: colors.white, fontWeight: "700", fontSize: fontSizes.base },
  lockText:   { fontSize: fontSizes.sm, color: colors.muted, textAlign: "center", marginTop: spacing.xs },
  certCard:   { backgroundColor: colors.blueLight, borderRadius: radii.lg, padding: spacing.lg, flexDirection: "row", gap: spacing.md, alignItems: "center", marginTop: spacing.sm },
  certIcon:   { fontSize: 36 },
  certInfo:   { flex: 1 },
  certTitle:  { fontSize: fontSizes.md, fontWeight: "700", color: colors.blue },
  certDesc:   { fontSize: fontSizes.sm, color: colors.muted, marginTop: 4, lineHeight: 20 },
});
