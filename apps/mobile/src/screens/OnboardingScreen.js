import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Dimensions, KeyboardAvoidingView, Platform
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    title: "வணக்கம்! நான் விது 🦉",
    body: "கல்வி.AI-க்கு வரவேற்கிறேன்!\nAI பற்றி சேர்ந்து கற்போம் — தமிழில்!",
    btn: "தொடங்கலாமா?",
  },
  {
    title: "உன் பெயர் என்ன?",
    body: null,
    btn: "அடுத்தது →",
  },
  {
    title: "உன் பள்ளி எது?",
    body: null,
    btn: "கல்வி.AI தொடங்கு 🚀",
  },
];

const CLASSES = ["6", "7", "8", "9", "10"];

export default function OnboardingScreen({ onDone }) {
  const [step, setStep]     = useState(0);
  const [name, setName]     = useState("");
  const [school, setSchool] = useState("");
  const [cls, setCls]       = useState("");

  function next() {
    if (step === 0) return setStep(1);
    if (step === 1 && name.trim()) return setStep(2);
    if (step === 2 && school.trim() && cls) return onDone({ name, school, cls });
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.flex}>
        <View style={s.container}>

          {/* Owl */}
          <View style={s.owlWrap}>
            <Text style={s.owl}>🦉</Text>
          </View>

          {/* Brand */}
          <Text style={s.brand}>கல்வி.AI</Text>
          <Text style={s.tagline}>AI கற்போம் — தமிழில்</Text>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>{STEPS[step].title}</Text>

            {STEPS[step].body && (
              <Text style={s.cardBody}>{STEPS[step].body}</Text>
            )}

            {step === 1 && (
              <TextInput
                style={s.input}
                placeholder="உன் பெயர் இங்கே..."
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            )}

            {step === 2 && (
              <View style={s.gap}>
                <TextInput
                  style={s.input}
                  placeholder="பள்ளி பெயர்..."
                  placeholderTextColor={colors.muted}
                  value={school}
                  onChangeText={setSchool}
                  autoFocus
                />
                <Text style={s.label}>வகுப்பு தேர்வு செய்:</Text>
                <View style={s.classRow}>
                  {CLASSES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[s.classPill, cls === c && s.classPillSel]}
                      onPress={() => setCls(c)}>
                      <Text style={[s.classPillText, cls === c && s.classPillTextSel]}>
                        {c}ஆம்
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity style={s.btn} onPress={next}>
              <Text style={s.btnText}>{STEPS[step].btn}</Text>
            </TouchableOpacity>

            {/* Dots */}
            <View style={s.dots}>
              {STEPS.map((_, i) => (
                <View key={i} style={[s.dot, i === step && s.dotActive]} />
              ))}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.blueLight },
  flex:      { flex: 1 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  owlWrap:   { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.goldLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  owl:       { fontSize: 40 },
  brand:     { fontSize: fontSizes.xxl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  tagline:   { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.xl },
  card:      { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing.xxl, width: "100%", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  cardTitle: { fontSize: fontSizes.lg, fontWeight: "700", color: colors.ink, marginBottom: spacing.sm },
  cardBody:  { fontSize: fontSizes.md, color: colors.muted, lineHeight: 24, marginBottom: spacing.lg },
  input:     { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, fontSize: fontSizes.md, color: colors.ink, marginBottom: spacing.sm },
  gap:       { gap: spacing.sm },
  label:     { fontSize: fontSizes.sm, color: colors.muted, marginTop: spacing.sm },
  classRow:  { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", marginBottom: spacing.sm },
  classPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border },
  classPillSel:     { backgroundColor: colors.blue, borderColor: colors.blue },
  classPillText:    { fontSize: fontSizes.base, color: colors.muted, fontWeight: "600" },
  classPillTextSel: { color: colors.white },
  btn:       { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.lg, alignItems: "center", marginTop: spacing.lg },
  btnText:   { color: colors.white, fontWeight: "700", fontSize: fontSizes.md },
  dots:      { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.lg },
  dot:       { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 20, backgroundColor: colors.blue },
});
