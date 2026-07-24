import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";
import { fetchSchools, loginStudent } from "../utils/supabase";

const CLASS_SECTIONS = [
  "6A","6B","6C",
  "7A","7B","7C",
  "8A","8B","8C",
  "9A","9B","9C",
  "10A","10B","10C",
  "11A","11B","11C",
  "12A","12B","12C",
];

const STEPS = [
  { title: "வணக்கம்! நான் விது 🦉",  body: "கல்வி.AI-க்கு வரவேற்கிறேன்!\nபாடம் எதுவும் கேட்கலாம் — தமிழில்!", btn: "தொடங்கலாமா?"         },
  { title: "உன் பள்ளி எது?",          body: "உன் பள்ளியை தேர்வு செய்",                                           btn: "அடுத்தது →"          },
  { title: "வகுப்பு தேர்வு செய்",      body: "உன் வகுப்பு மற்றும் பிரிவை தேர்வு செய்",                           btn: "அடுத்தது →"          },
  { title: "உன் விவரங்கள்",            body: "உன் பெயர், roll number மற்றும் PIN கொடு",                          btn: "கல்வி.AI தொடங்கு 🚀" },
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

  useEffect(() => {
    if (step === 1) loadSchools();
  }, [step]);

  async function loadSchools() {
    setSchoolsLoading(true);
    setSchoolsError("");
    const { data, error } = await fetchSchools();
    if (error) setSchoolsError("பள்ளிகள் ஏற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.");
    else setSchools(data || []);
    setSchoolsLoading(false);
  }

  function canNext() {
    if (step === 0) return true;
    if (step === 1) return !!school;
    if (step === 2) return !!classSection;
    if (step === 3) return name.trim().length > 0 && roll.trim().length > 0 && pin.length === 4;
    return false;
  }

  async function next() {
    if (!canNext()) { setError("அனைத்தையும் தேர்வு செய்க"); return; }
    setError("");
    if (step < 3) { setStep(s => s + 1); return; }

    // Authenticate against Supabase
    setAuthLoading(true);
    const { student: dbStudent, error: authError } = await loginStudent(
      school.id, roll.trim(), name.trim(), pin
    );
    setAuthLoading(false);

    if (authError) {
      setError(authError);
      return;
    }

    onDone({
      ...dbStudent,
      school,
      classSection,
      cls: classSection.replace(/[A-Z]/g, ""),
      section: classSection.slice(-1),
    });
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.flex}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

          <View style={s.owlWrap}><Text style={s.owl}>🦉</Text></View>
          <Text style={s.brand}>கல்வி.AI</Text>
          <Text style={s.tagline}>AI கற்போம் — தமிழில்</Text>

          <View style={s.card}>
            <Text style={s.cardTitle}>{STEPS[step].title}</Text>
            <Text style={s.cardBody}>{STEPS[step].body}</Text>

            {step === 1 && (
              <View style={s.optionsList}>
                {schoolsLoading && (
                  <View style={s.loadingWrap}>
                    <ActivityIndicator color={colors.blue} />
                    <Text style={s.loadingText}>பள்ளிகள் ஏற்றுகிறோம்...</Text>
                  </View>
                )}
                {schoolsError ? (
                  <View>
                    <Text style={s.error}>{schoolsError}</Text>
                    <TouchableOpacity style={s.retryBtn} onPress={loadSchools}>
                      <Text style={s.retryText}>மீண்டும் முயற்சி</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {!schoolsLoading && schools.length === 0 && !schoolsError && (
                  <Text style={s.emptyText}>இன்னும் பள்ளிகள் சேர்க்கவில்லை</Text>
                )}
                {schools.map(sc => (
                  <TouchableOpacity
                    key={sc.id}
                    style={[s.optionCard, school?.id === sc.id && s.optionCardSel]}
                    onPress={() => setSchool(sc)}>
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
            )}

            {step === 2 && (
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
            )}

            {step === 3 && (
              <View style={s.formGap}>
                <Text style={s.label}>பெயர்</Text>
                <TextInput style={s.input} placeholder="உன் பெயர்..." placeholderTextColor={colors.muted}
                  value={name} onChangeText={setName} autoFocus />
                <Text style={s.label}>Roll Number</Text>
                <TextInput style={s.input} placeholder="உதா: 001" placeholderTextColor={colors.muted}
                  value={roll} onChangeText={setRoll} keyboardType="numeric" />
                <Text style={s.label}>PIN (4 இலக்கம்)</Text>
                <View style={s.pinRow}>
                  <TextInput style={[s.input, s.pinInput]} placeholder="••••" placeholderTextColor={colors.muted}
                    value={pin} onChangeText={t => setPin(t.slice(0, 4))}
                    keyboardType="numeric" secureTextEntry={!showPin} maxLength={4} />
                  <TouchableOpacity style={s.showPinBtn} onPress={() => setShowPin(p => !p)}>
                    <Text style={s.showPinText}>{showPin ? "மறை" : "காட்டு"}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.hint}>PIN மறந்துவிட்டதா? உன் ஆசிரியரிடம் கேள்.</Text>
              </View>
            )}

            {error ? <Text style={s.error}>{error}</Text> : null}

            <TouchableOpacity style={[s.btn, (!canNext() || authLoading) && s.btnDisabled]} onPress={next}>
              <Text style={s.btnText}>{authLoading ? 'சரிபார்க்கிறோம்...' : STEPS[step].btn}</Text>
            </TouchableOpacity>

            <View style={s.dots}>
              {STEPS.map((_, i) => (
                <View key={i} style={[s.dot, i === step && s.dotActive, i < step && s.dotDone]} />
              ))}
            </View>
          </View>

          {step > 1 && school && (
            <View style={s.infoPill}>
              <Text style={s.infoPillText}>🏫 {school.name} • {classSection}</Text>
            </View>
          )}

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
  optionsList:      { gap: spacing.sm, marginBottom: spacing.sm },
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
  retryBtn:         { backgroundColor: colors.blueLight, borderRadius: radii.md, padding: spacing.md, alignItems: "center", marginTop: spacing.sm },
  retryText:        { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
  classGrid:        { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.sm },
  classPill:        { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cream },
  classPillSel:     { backgroundColor: colors.blue, borderColor: colors.blue },
  classPillText:    { fontSize: fontSizes.base, color: colors.muted, fontWeight: "600" },
  classPillTextSel: { color: colors.white },
  formGap:          { gap: spacing.sm },
  label:            { fontSize: fontSizes.sm, color: colors.muted, fontWeight: "600", marginTop: spacing.xs },
  input:            { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, fontSize: fontSizes.md, color: colors.ink },
  pinRow:           { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  pinInput:         { flex: 1, letterSpacing: 8, fontSize: fontSizes.xl },
  showPinBtn:       { padding: spacing.sm },
  showPinText:      { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
  hint:             { fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing.xs },
  error:            { color: colors.terra, fontSize: fontSizes.sm, textAlign: "center", marginBottom: spacing.sm },
  btn:              { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.lg, alignItems: "center", marginTop: spacing.lg },
  btnDisabled:      { backgroundColor: colors.muted },
  btnText:          { color: colors.white, fontWeight: "700", fontSize: fontSizes.md },
  dots:             { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.lg },
  dot:              { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive:        { width: 20, backgroundColor: colors.blue },
  dotDone:          { backgroundColor: colors.success },
  infoPill:         { backgroundColor: colors.blueLight, borderRadius: radii.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  infoPillText:     { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
});
