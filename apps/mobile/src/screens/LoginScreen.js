import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

// Mock student data — will come from Supabase later
const MOCK_STUDENTS = [
  { id: "1", name: "பிரியா",      roll: "001", pin: "1234", cls: "8", school: "அரசு உயர்நிலை பள்ளி, தர்மபுரி" },
  { id: "2", name: "அர்ஜுன்",    roll: "002", pin: "2345", cls: "8", school: "அரசு உயர்நிலை பள்ளி, தர்மபுரி" },
  { id: "3", name: "கவிதா",      roll: "003", pin: "3456", cls: "8", school: "அரசு உயர்நிலை பள்ளி, தர்மபுரி" },
];

export default function LoginScreen({ onDone }) {
  const [roll, setRoll]         = useState("");
  const [pin, setPin]           = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPin, setShowPin]   = useState(false);

  function login() {
    setError("");
    if (!roll.trim() || !pin.trim() || !name.trim()) {
      setError("அனைத்து தகவல்களும் தேவை");
      return;
    }

    setLoading(true);

    // Mock authentication — replace with Supabase call later
    setTimeout(() => {
      const student = MOCK_STUDENTS.find(
        s => s.roll === roll.trim() &&
             s.pin === pin.trim() &&
             s.name.includes(name.trim().slice(0, 2))
      );

      if (student) {
        onDone(student);
      } else {
        setError("தகவல்கள் சரியில்லை. ஆசிரியரிடம் கேளுங்கள்.");
      }
      setLoading(false);
    }, 800);
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.flex}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

          {/* Owl + Brand */}
          <View style={s.owlWrap}>
            <Text style={s.owl}>🦉</Text>
          </View>
          <Text style={s.brand}>கல்வி.AI</Text>
          <Text style={s.tagline}>AI கற்போம் — தமிழில்</Text>

          {/* Login card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>உள்நுழைக</Text>
            <Text style={s.cardSub}>ஆசிரியர் தந்த roll number மற்றும் PIN பயன்படுத்துங்கள்</Text>

            {/* Name */}
            <Text style={s.label}>உன் பெயர்</Text>
            <TextInput
              style={s.input}
              placeholder="உன் பெயர்..."
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            {/* Roll number */}
            <Text style={s.label}>Roll Number</Text>
            <TextInput
              style={s.input}
              placeholder="உதா: 001"
              placeholderTextColor={colors.muted}
              value={roll}
              onChangeText={setRoll}
              keyboardType="numeric"
            />

            {/* PIN */}
            <Text style={s.label}>PIN (4 இலக்கம்)</Text>
            <View style={s.pinWrap}>
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
              <TouchableOpacity style={s.showPin} onPress={() => setShowPin(p => !p)}>
                <Text style={s.showPinText}>{showPin ? "மறை" : "காட்டு"}</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={s.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={login}
              disabled={loading}>
              <Text style={s.btnText}>{loading ? "சரிபார்க்கிறோம்..." : "உள்நுழை →"}</Text>
            </TouchableOpacity>

            <Text style={s.hint}>PIN மறந்துவிட்டதா? உன் ஆசிரியரிடம் கேள்.</Text>
          </View>

          {/* Demo hint */}
          <View style={s.demoCard}>
            <Text style={s.demoTitle}>Demo Login:</Text>
            <Text style={s.demoText}>பெயர்: பிரியா | Roll: 001 | PIN: 1234</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.blueLight },
  flex:        { flex: 1 },
  container:   { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  owlWrap:     { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.goldLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  owl:         { fontSize: 40 },
  brand:       { fontSize: fontSizes.xxl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  tagline:     { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.xl },
  card:        { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing.xxl, width: "100%", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4, marginBottom: spacing.lg },
  cardTitle:   { fontSize: fontSizes.xl, fontWeight: "800", color: colors.blue, marginBottom: 6 },
  cardSub:     { fontSize: fontSizes.sm, color: colors.muted, marginBottom: spacing.lg, lineHeight: 20 },
  label:       { fontSize: fontSizes.sm, color: colors.muted, marginBottom: 6, fontWeight: "600" },
  input:       { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, fontSize: fontSizes.md, color: colors.ink, marginBottom: spacing.md },
  pinWrap:     { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  pinInput:    { flex: 1, marginBottom: 0, letterSpacing: 8, fontSize: fontSizes.xl },
  showPin:     { marginLeft: spacing.sm, padding: spacing.sm },
  showPinText: { fontSize: fontSizes.sm, color: colors.blue, fontWeight: "600" },
  error:       { color: colors.terra, fontSize: fontSizes.sm, marginBottom: spacing.md, textAlign: "center" },
  btn:         { backgroundColor: colors.blue, borderRadius: radii.md, padding: spacing.lg, alignItems: "center", marginTop: spacing.sm },
  btnDisabled: { backgroundColor: colors.muted },
  btnText:     { color: colors.white, fontWeight: "700", fontSize: fontSizes.md },
  hint:        { fontSize: fontSizes.xs, color: colors.muted, textAlign: "center", marginTop: spacing.md },
  demoCard:    { backgroundColor: colors.goldLight, borderRadius: radii.md, padding: spacing.md, width: "100%", alignItems: "center" },
  demoTitle:   { fontSize: fontSizes.sm, fontWeight: "700", color: colors.gold, marginBottom: 4 },
  demoText:    { fontSize: fontSizes.xs, color: colors.muted },
});
