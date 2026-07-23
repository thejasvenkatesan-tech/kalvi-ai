import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import OnboardingScreen  from "./src/screens/OnboardingScreen";
import HomeScreen        from "./src/screens/HomeScreen";
import MissionsScreen    from "./src/screens/MissionsScreen";
import VidhuScreen       from "./src/screens/VidhuScreen";
import BadgesScreen      from "./src/screens/BadgesScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import { colors, spacing, fontSizes } from "./src/constants/tokens";

// ── Paste your Gemini API key here for testing ──────────────────────────────
const GEMINI_API_KEY = "AQ.Ab8RN6K3QFwE3e5P2DYURV-TMw6NZxPdJ1r5HIqdl8euDt0Jiw"; // dev only
// ────────────────────────────────────────────────────────────────────────────

const INITIAL_MISSIONS = [
  { id: 1, title: "AI என்ன செய்கிறது?",    desc: "விதுவிடம் AI பற்றி கேள் — பதிலை மதிப்பிடு",    icon: "🤖", xp: 20, done: false, week: 1, prompt: "விது, AI என்றால் என்ன? எனக்கு எளிமையாக சொல்லு." },
  { id: 2, title: "வீட்டில் AI கண்டுபிடி", desc: "3 AI பொருட்களை உன் வாழ்க்கையில் தேடு",         icon: "🔍", xp: 30, done: false, week: 2, prompt: "விது, எனது வீட்டில் AI பயன்படுத்தும் 3 பொருட்களை கண்டுபிடிக்க உதவு." },
  { id: 3, title: "AI தவறாக சொல்லும்!",   desc: "விதுவிடம் ஒரு தவறான பதில் கண்டுபிடி",          icon: "🧐", xp: 40, done: false, week: 3, prompt: "விது, நீ ஒரு தவறான தகவல் சொல்வாயா? நான் அதை கண்டுபிடிக்கிறேன்!" },
  { id: 4, title: "குடும்பத்திற்கு சொல்லு", desc: "AI பற்றி உன் அம்மா அல்லது அப்பாவிடம் சொல்லு", icon: "👨‍👩‍👧", xp: 50, done: false, week: 4, prompt: "விது, என் அம்மாவிடம் AI பற்றி எளிமையாக சொல்ல என்ன சொல்வேன்?" },
];

const INITIAL_BADGES = [
  { id: "first_chat",  icon: "💬", name_ta: "முதல் உரையாடல்", name_en: "First Chat",    earned: false },
  { id: "mission_1",   icon: "🌟", name_ta: "AI அறிவாளி",     name_en: "AI Knower",     earned: false },
  { id: "streak_3",    icon: "🔥", name_ta: "3 நாள் streak",   name_en: "3-Day Streak",  earned: false },
  { id: "bronze_cert", icon: "🥉", name_ta: "AI சான்றிதழ்",   name_en: "Bronze Cert",   earned: false },
];

const TABS = [
  { id: "home",        label: "முகப்பு",   icon: "🏠" },
  { id: "missions",    label: "பணிகள்",    icon: "🎯" },
  { id: "vidhu",       label: "விது",      icon: "🦉" },
  { id: "badges",      label: "பட்ஜ்கள்", icon: "🏅" },
  { id: "leaderboard", label: "தரவரிசை",  icon: "🏆" },
];

export default function App() {
  const [user, setUser]               = useState(null);
  const [tab, setTab]                 = useState("home");
  const [missions, setMissions]       = useState(INITIAL_MISSIONS);
  const [badges, setBadges]           = useState(INITIAL_BADGES);
  const [activeMission, setActiveMission] = useState(null);
  const [toast, setToast]             = useState("");
  const streak = 3;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function awardBadge(id) {
    setBadges(b => b.map(x => x.id === id ? { ...x, earned: true } : x));
  }

  function onFirstChat() {
    if (!badges.find(b => b.id === "first_chat")?.earned) {
      awardBadge("first_chat");
      showToast("🏅 பட்ஜ் கிடைத்தது: முதல் உரையாடல்!");
    }
  }

  function onMissionComplete(id) {
    const mission = missions.find(m => m.id === id);
    if (!mission || mission.done) return;
    setMissions(ms => ms.map(m => m.id === id ? { ...m, done: true } : m));
    showToast(`⭐ +${mission.xp} XP! பணி முடிந்தது!`);
    if (id === 1) awardBadge("mission_1");
    const doneCount = missions.filter(m => m.done).length + 1;
    if (doneCount >= 4) {
      awardBadge("bronze_cert");
      showToast("🥉 Bronze Certificate கிடைத்தது!");
    }
  }

  function onMissionLaunch(mission) {
    setActiveMission(mission);
    setTab("vidhu");
  }

  if (!user) return <OnboardingScreen onDone={setUser} />;

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.topBrand}>கல்வி.AI 🦉</Text>
        <Text style={s.topStreak}>🔥 {streak} நாள்</Text>
      </View>

      {/* Toast */}
      {toast ? (
        <View style={s.toast}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* Screens */}
      <View style={s.screen}>
        {tab === "home"        && <HomeScreen user={user} missions={missions} badges={badges} streak={streak} onMissionLaunch={onMissionLaunch} setTab={setTab} />}
        {tab === "missions"    && <MissionsScreen missions={missions} onLaunch={onMissionLaunch} />}
        {tab === "vidhu"       && <VidhuScreen apiKey={GEMINI_API_KEY} activeMission={activeMission} onMissionComplete={onMissionComplete} onFirstChat={onFirstChat} />}
        {tab === "badges"      && <BadgesScreen badges={badges} />}
        {tab === "leaderboard" && <LeaderboardScreen />}
      </View>

      {/* Bottom nav */}
      <View style={s.nav}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} style={s.navItem} onPress={() => setTab(t.id)}>
            <Text style={s.navIcon}>{t.icon}</Text>
            <Text style={[s.navLabel, tab === t.id && s.navLabelActive]}>{t.label}</Text>
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
  topStreak:      { fontSize: fontSizes.sm, color: "rgba(255,255,255,0.85)", fontWeight: "600" },
  toast:          { position: "absolute", top: 110, alignSelf: "center", backgroundColor: colors.success, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: 24, zIndex: 99, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6 },
  toastText:      { color: colors.white, fontWeight: "700", fontSize: fontSizes.base },
  screen:         { flex: 1 },
  nav:            { flexDirection: "row", backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: Platform.OS === "ios" ? 20 : 8 },
  navItem:        { flex: 1, alignItems: "center", paddingTop: spacing.sm, paddingBottom: 4 },
  navIcon:        { fontSize: 20 },
  navLabel:       { fontSize: 10, color: colors.muted, marginTop: 2 },
  navLabelActive: { color: colors.blue, fontWeight: "700" },
  navDot:         { width: 16, height: 2, borderRadius: 1, backgroundColor: colors.blue, marginTop: 3 },
});
