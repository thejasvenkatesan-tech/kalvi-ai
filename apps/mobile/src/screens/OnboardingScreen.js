import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";
import { searchSchools, loginStudent } from "../utils/supabase";

const CLASS_SECTIONS = [
  "6A","6B","6C","7A","7B","7C",
  "8A","8B","8C","9A","9B","9C",
  "10A","10B","10C","11A","11B","11C","12A","12B","12C",
];

export default function OnboardingScreen({ onDone }) {
  const [step, setStep]                     = useState(0);
  const [schools, setSchools]               = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError]     = useState("");
  const [school, setSchool]                 = useState(null);
  const [classSection, setClassSection]     = useState("");
  const [name, setName]                     = useState("");
  const [roll, setRoll]                     = useState("");
  const [pin, setPin]                       = useState("");
  const [showPin, setShowPin]               = useState(false);
  const [error, setError]                   = useState("");
  const [authLoading, setAuthLoading]       = useState(false);

  const [schoolQuery, setSchoolQuery] = useState('');

  useEffect(() => {
    if (step !== 1) return;
    if (schoolQuery.length < 2) { setSchools([]); setSchoolsError(''); return; }
    const timer = setTimeout(() => doSearch(), 400);
    return () => clearTimeout(timer);
  }, [schoolQuery, step]);

  async function doSearch() {
    setSchoolsLoading(true);
    setSchoolsError('');
    try {
      const { data, error } = await searchSchools(schoolQuery);
      if (error) setSchoolsError('பள்ளிகள் ஏற்றுவதில் பிழை');
      else setSchools(data || []);
    } catch(e) {
      setSchoolsError('');
    }
    setSchoolsLoading(false);
  }

  async function login() {
    if (!name.trim() || !roll.trim() || pin.length !== 4 || !classSection) {
      setError("அனைத்து தகவல்களும் தேவை");
      return;
    }
    setAuthLoading(true);
    setError("");
    const { student, error: authError } = await loginStudent(school.id, roll.trim(), name.trim(), pin);
    setAuthLoading(false);
    if (authError) { setError(authError); return; }
    onDone({ ...student, school, classSection, cls: classSection.replace(/[A-Z]/g, ""), section: classSection.slice(-1) });
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.flex}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

          <View style={s.owlWrap}><Text style={s.owl}>🦉</Text></View>
          <Text style={s.brand}>கல்வி.AI</Text>
          <Text style={s.tagline}>AI கற்போம் — தமிழில்</Text>

          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>வணக்கம்! நான் விது 🦉</Text>
              <Text style={s.cardBody}>கல்வி.AI-க்கு வரவேற்கிறேன்!{"\n"}எந்த பாடமும் கேட்கலாம் — தமிழில்!</Text>
              <TouchableOpacity style={s.btn} onPress={() => setStep(1)}>
                <Text style={s.btnText}>தொடங்கலாமா? →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 1 — School */}
          {step === 1 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>உன் பள்ளி எது?</Text>
              <View style={s.searchWrap}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput
                  style={s.searchInput}
                  value={schoolQuery}
                  onChangeText={setSchoolQuery}
                  placeholder="பள்ளி பெயர் தேடுக..."
                  placeholderTextColor="#aaa"
                  autoCorrect={false}
                />
              </View>
              {schoolsLoading && (
                <View style={s.loadingWrap}>
                  <ActivityIndicator color={colors.blue} />
                  <Text style={s.loadingText}>தேடுகிறோம்...</Text>
                </View>
              )}
              {schoolsError ? (
                <Text style={s.error}>{schoolsError}</Text>
              ) : null}
              {!schoolsLoading && schoolQuery.length >= 2 && schools.length === 0 && !schoolsError && (
                <Text style={s.emptyText}>பள்ளி கிடைக்கவில்லை. வேறு பெயரில் தேடுங்கள்.</Text>
              )}
              {schoolQuery.length < 2 && !school && (
                <Text style={s.hintText}>குறைந்தது 2 எழுத்துக்கள் தட்டச்சு செய்யுங்கள்</Text>
              )}
              <View style={s.optionsList}>
                {schools.map(sc => (
                  <TouchableOpacity
                    key={sc.id}
                    style={[s.optionCard, school?.id === sc.id && s.optionCardSel]}
                    onPress={() => { setSchool(sc); setSchools([]); setSchoolQuery(sc.name); }}>
                    <View style={s.optionRow}>
                      <Text style={s.optionIcon}>🏫</Text>
                      <View style={s.optionInfo}>
                        <Text style={[s.optionTitle, school?.id === sc.id && s.optionTitleSel]}>{sc.name}</Text>
                        <Text style={s.optionSub}>{sc.district} • {sc.code}</Text>
                      </View>
                      {school?.id === sc.id && <Text style={s.optionCheck}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[s.btn, !school && s.btnDisabled]}
                onPress={() => school && setStep(2)}>
                <Text style={s.btnText}>அடுத்தது →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2 — All details on ONE screen */}
          {step === 2 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>உன் விவரங்கள்</Text>

              {/* School info pill */}
              <View style={s.schoolPill}>
                <Text style={s.schoolPillText}>🏫 {school?.name}</Text>
              </View>

              {/* Class + Section */}
              <Text style={s.label}>வகுப்பு & பிரிவு</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.classScrollWrap}>
                <View style={s.classGrid}>
                  {CLASS_SECTIONS.map(cs => (
                    <TouchableOpacity
                      key={cs}
                      style={[s.classPill, classSection === cs && s.classPillSel]}
                      onPress={() => setClassSection(cs)}>
                      <Text style={[s.classPillText, classSection === cs && s.classPillTextSel]}>{cs}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Name */}
              <Text style={s.label}>பெயர்</Text>
              <TextInput
                style={s.input}
                placeholder="உன் பெயர்..."
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
              />

              {/* Roll + PIN side by side */}
              <View style={s.rowGap}>
                <View style={s.halfWrap}>
                  <Text style={s.label}>Roll Number</Text>
                  <TextInput
                    style={s.input}
                    placeholder="001"
                    placeholderTextColor={colors.muted}
                    value={roll}
                    onChangeText={setRoll}
                    keyboardType="numeric"
                  />
                </View>
                <View style={s.halfWrap}>
                  <Text style={s.label}>PIN</Text>
                  <View style={s.pinRow}>
                    <TextInput
                      style={[s.input, s.pinInput]}
                      placeholder="••••"
                      placeholderTextColor={colors.muted}
                      value={pin}
                      onChangeText={t => setPin(t.slice(0, 4))}
                      keyboardType="numeric"
                      secureTextEntry={!showPin}
                      maxLength={4}
                    />
                    <TouchableOpacity onPress={() => setShowPin(p => !p)} style={s.showPinBtn}>
                      <Text style={s.showPinText}>{showPin ? "🙈" : "👁"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={s.hint}>PIN மறந்துவிட்டதா? உன் ஆசிரியரிடம் கேள்.</Text>

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.btn, authLoading && s.btnDisabled]}
                onPress={login}
                disabled={authLoading}>
                <Text style={s.btnText}>{authLoading ? "சரிபார்க்கிறோம்..." : "கல்வி.AI தொடங்கு 🚀"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(1)} style={s.backBtn}>
                <Text style={s.backBtnText}>← பள்ளி மாற்றவும்</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Progress dots */}
          <View style={s.dots}>
            {[0,1,2].map(i => (
              <View key={i} style={[s.dot, i === step && s.dotActive, i < step && s.dotDone]} />
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.blueLight },
  flex:             { flex: 1 },
  container:        { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, paddingBottom: spacing.xxxl },
  owlWrap:          { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.goldLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  owl:              { fontSize: 36 },
  brand:            { fontSize: fontSizes.xxl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  tagline:          { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.xl },
  card:             { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing.xl, width: "100%", elevation: 4, marginBottom: spacing.md },
  cardTitle:        { fontSize: fontSizes.lg, fontWeight: "800", color: colors.blue, marginBottom: 6 },
  cardBody:         { fontSize: fontSizes.sm, color: colors.muted, lineHeight: 20, marginBottom: spacing.lg },
  schoolPill:       { backgroundColor: colors.blueLight, borderRadius: radii.full, padding: spacing.sm, marginBottom: spacing.md, alignItems: "center" },
  schoolPillText:   { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
  label:            { fontSize: fontSizes.sm, color: colors.muted, fontWeight: "600", marginBottom: spacing.xs, marginTop: spacing.sm },
  classScrollWrap:  { marginBottom: spacing.sm },
  classGrid:        { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, paddingVertical: spacing.xs },
  classPill:        { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cream },
  classPillSel:     { backgroundColor: colors.blue, borderColor: colors.blue },
  classPillText:    { fontSize: fontSizes.base, color: colors.muted, fontWeight: "600" },
  classPillTextSel: { color: colors.white },
  input:            { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, fontSize: fontSizes.md, color: colors.ink },
  rowGap:           { flexDirection: "row", gap: spacing.md },
  halfWrap:         { flex: 1 },
  pinRow:           { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  pinInput:         { flex: 1, letterSpacing: 6, fontSize: fontSizes.xl },
  showPinBtn:       { padding: spacing.xs },
  showPinText:      { fontSize: 18 },
  hint:             { fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.sm },
  error:            { color: colors.terra, fontSize: fontSizes.sm, textAlign: "center", marginBottom: spacing.sm },
  btn:              { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.lg, alignItems: "center", marginTop: spacing.md },
  btnDisabled:      { backgroundColor: colors.muted },
  btnText:          { color: colors.white, fontWeight: "700", fontSize: fontSizes.md },
  backBtn:          { alignItems: "center", marginTop: spacing.md },
  backBtnText:      { fontSize: fontSizes.sm, color: colors.muted },
  optionsList:      { gap: spacing.sm, marginBottom: spacing.md },
  optionCard:       { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md, backgroundColor: colors.cream },
  optionCardSel:    { borderColor: colors.blue, backgroundColor: colors.blueLight },
  optionRow:        { flexDirection: "row", alignItems: "center", gap: spacing.md },
  optionIcon:       { fontSize: 24 },
  optionInfo:       { flex: 1 },
  optionTitle:      { fontSize: fontSizes.base, fontWeight: "600", color: colors.ink },
  optionTitleSel:   { color: colors.blue },
  optionSub:        { fontSize: fontSizes.xs, color: colors.muted, marginTop: 2 },
  optionCheck:      { fontSize: fontSizes.lg, color: colors.blue, fontWeight: "700" },
  loadingWrap:      { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md },
  loadingText:      { fontSize: fontSizes.sm, color: colors.muted },
  emptyText:        { fontSize: fontSizes.sm, color: colors.muted, textAlign: "center", padding: spacing.lg },
  retryBtn:         { backgroundColor: colors.blueLight, borderRadius: radii.md, padding: spacing.md, alignItems: "center" },
  retryText:        { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
  dots:             { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.md },
  dot:              { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive:        { width: 20, backgroundColor: colors.blue },
  dotDone:          { backgroundColor: colors.success },
});
