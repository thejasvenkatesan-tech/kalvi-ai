import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoginScreen    from "./src/screens/LoginScreen";
import HomeScreen     from "./src/screens/HomeScreen";
import VidhuScreen    from "./src/screens/VidhuScreen";
import SavedScreen    from "./src/screens/SavedScreen";
import { colors, spacing, fontSizes } from "./src/constants/tokens";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; // dev only

const TABS = [
  { id: "home",  label: "முகப்பு", icon: "🏠" },
  { id: "vidhu", label: "விது",    icon: "🦉" },
  { id: "saved", label: "சேமிப்பு", icon: "🔖" },
];

export default function App() {
  const [student, setStudent]             = useState(null);
  const [tab, setTab]                     = useState("home");
  const [savedReplies, setSavedReplies]   = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [toast, setToast]                 = useState("");
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [unreadSaved, setUnreadSaved] = useState(0);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function onSaveReply(question, answer, subject) {
    const reply = { id: Date.now().toString(), question, answer, subject, savedAt: new Date().toISOString() };
    setSavedReplies(r => [reply, ...r]);
    setUnreadSaved(n => n + 1);
    showToast("🔖 பதில் சேமிக்கப்பட்டது!");
  }

  function onQuestionAsked() {
    setQuestionsAsked(q => q + 1);
  }

  if (!student) return <LoginScreen onDone={setStudent} />;

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.topBrand}>கல்வி.AI 🦉</Text>
        <Text style={s.topStudent}>{student.name} • {student.cls}ஆம் வகுப்பு</Text>
      </View>

      {/* Toast */}
      {toast ? <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View> : null}

      {/* Screens */}
      <View style={s.screen}>
        {tab === "home"  && <HomeScreen student={student} questionsAsked={questionsAsked} savedCount={savedReplies.length} setTab={setTab} />}
        {tab === "vidhu" && <VidhuScreen apiKey={GEMINI_API_KEY} studentClass={student.cls} onSaveReply={onSaveReply} onQuestionAsked={onQuestionAsked} />}
        {tab === "saved" && <SavedScreen savedReplies={savedReplies} setSavedReplies={setSavedReplies} student={student} />}
      </View>

      {/* Bottom nav */}
      <View style={s.nav}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} style={s.navItem} onPress={() => { setTab(t.id); if (t.id === "saved") setUnreadSaved(0); }}>
            <Text style={s.navIcon}>{t.icon}</Text>
            <Text style={[s.navLabel, tab === t.id && s.navLabelActive]}>{t.label}</Text>
            {t.id === "saved" && unreadSaved > 0 && (
              <View style={s.badge}><Text style={s.badgeText}>{unreadSaved}</Text></View>
            )}
            {tab === t.id && <View style={s.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: colors.cream },
  topBar:         { backgroundColor: colors.blue, paddingTop: Platform.OS === "ios" ? 54 : 40, paddingBottom: spacing.md, paddingHorizontal: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topBrand:       { fontSize: fontSizes.lg, fontWeight: "800", color: colors.white },
  topStudent:     { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.8)" },
  toast:          { position: "absolute", top: 110, alignSelf: "center", backgroundColor: colors.success, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: 24, zIndex: 99, elevation: 6 },
  toastText:      { color: colors.white, fontWeight: "700", fontSize: fontSizes.base },
  screen:         { flex: 1 },
  nav:            { flexDirection: "row", backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: Platform.OS === "ios" ? 20 : 8 },
  navItem:        { flex: 1, alignItems: "center", paddingTop: spacing.sm, paddingBottom: 4, position: "relative" },
  navIcon:        { fontSize: 20 },
  navLabel:       { fontSize: 10, color: colors.muted, marginTop: 2 },
  navLabelActive: { color: colors.blue, fontWeight: "700" },
  navDot:         { width: 16, height: 2, borderRadius: 1, backgroundColor: colors.blue, marginTop: 3 },
  badge:          { position: "absolute", top: 4, right: 12, backgroundColor: colors.terra, borderRadius: 10, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center" },
  badgeText:      { color: colors.white, fontSize: 10, fontWeight: "700" },
});
