import { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView
} from "react-native";
import * as Speech from "expo-speech";

// Safe import for speech recognition — only works in native build, not Expo Go
let ExpoSpeechRecognitionModule = null;
let useSpeechRecognitionEvent = () => {};
try {
  const SpeechRec = require("expo-speech-recognition");
  ExpoSpeechRecognitionModule = SpeechRec.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = SpeechRec.useSpeechRecognitionEvent;
} catch (e) {
  console.log("Speech recognition not available in Expo Go");
}
import { colors, spacing, radii, fontSizes } from "../constants/tokens";
import { askVidhu, getOfflineAnswer, MARK_SCHEMES } from "../utils/vidhu";

const SUGGESTIONS = [
  "ஒளிச்சேர்க்கை என்றால் என்ன?",
  "நியூட்டன் விதிகள் சொல்லு",
  "AI என்றால் என்ன?",
  "தமிழ் இலக்கணம் விளக்கு",
];

// ── Simple Markdown Renderer ───────────────────────────────────────────────
function SimpleMarkdown({ text }) {
  const lines = (text || "").split("\n");
  const elements = [];
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<View key={i} style={{ height: 6 }} />); return; }
    if (trimmed.startsWith("### ")) {
      elements.push(<Text key={i} style={md.h3}>{trimmed.replace(/^###\s*/, "").replace(/\*\*/g, "")}</Text>);
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(<Text key={i} style={md.h2}>{trimmed.replace(/^##\s*/, "").replace(/\*\*/g, "")}</Text>);
      return;
    }
    if (trimmed === "---") { elements.push(<View key={i} style={md.divider} />); return; }
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const t = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "$1");
      elements.push(<View key={i} style={md.bulletRow}><Text style={md.bullet}>•</Text><Text selectable style={md.bulletText}>{t}</Text></View>);
      return;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\.\s/)[1];
      const t = trimmed.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "$1");
      elements.push(<View key={i} style={md.bulletRow}><Text style={md.bullet}>{num}.</Text><Text selectable style={md.bulletText}>{t}</Text></View>);
      return;
    }
    if (trimmed.startsWith("💡")) {
      const tipText = trimmed.replace(/\*\*(.*?)\*\*/g, "$1");
      elements.push(<Text selectable key={i} style={md.tip} numberOfLines={0}>{tipText}</Text>);
      return;
    }
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const inline = parts.map((p, j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <Text key={j} style={md.bold}>{p.slice(2, -2)}</Text>
        : <Text key={j}>{p}</Text>
    );
    elements.push(<Text selectable key={i} style={md.p}>{inline}</Text>);
  });
  return <View>{elements}</View>;
}

const md = StyleSheet.create({
  h2:        { fontSize: 15, fontWeight: "800", color: "#1B3A6B", marginBottom: 4, marginTop: 6 },
  h3:        { fontSize: 14, fontWeight: "700", color: "#1B3A6B", marginBottom: 4, marginTop: 6 },
  p:         { fontSize: 14, color: "#1A1612", lineHeight: 22, marginBottom: 4 },
  bold:      { fontWeight: "700", color: "#1A1612" },
  bulletRow: { flexDirection: "row", gap: 6, marginBottom: 4, alignItems: "flex-start" },
  bullet:    { fontSize: 14, color: "#1B3A6B", fontWeight: "700", minWidth: 16 },
  bulletText:{ fontSize: 14, color: "#1A1612", lineHeight: 22, flex: 1 },
  tip:       { fontSize: 13, color: "#2D7A5F", backgroundColor: "#E1F0E9", borderRadius: 8, padding: 8, marginTop: 6 },
  divider:   { height: 1, backgroundColor: "#E2DDD7", marginVertical: 6 },
});

// ── Main Component ─────────────────────────────────────────────────────────
export default function VidhuScreen({ apiKey, studentClass = "8", onSaveReply, onQuestionAsked }) {
  const [msgs, setMsgs]               = useState([{
    id: "0", role: "assistant",
    content: "வணக்கம்! நான் விது 🦉\n\nபாடம் சம்பந்தமான எந்த கேள்வியும் கேட்கலாம் — தமிழில் அல்லது ஆங்கிலத்தில்!\n\nகணிதம், அறிவியல், தமிழ், சமூக அறிவியல், AI — எல்லாம் சொல்கிறேன்.\n\n🎤 குரலிலும் கேட்கலாம்!\n\n⚠️ நான் AI — தவறுகள் நடக்கலாம். எல்லா பதில்களையும் உன் ஆசிரியரிடம் உறுதி செய்துகொள்."
  }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [offline, setOffline]         = useState(false);
  const [markFilter, setMarkFilter]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating]   = useState({});
  const [speaking, setSpeaking]         = useState(null);
  const [listening, setListening]       = useState(false);
  const [voiceLang, setVoiceLang]       = useState("ta-IN");
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastAnswer, setLastAnswer]     = useState('');

  const listRef       = useRef();
  const apiKeyRef     = useRef(apiKey);
  const markFilterRef = useRef(markFilter);

  useEffect(() => { markFilterRef.current = markFilter; }, [markFilter]);

  const markScheme = MARK_SCHEMES[studentClass] || MARK_SCHEMES["8"];

  // ── Voice recognition events ───────────────────────────────────────────
  useSpeechRecognitionEvent("result", (e) => {
    const transcript = e.results?.[0]?.transcript || "";
    if (transcript) setInput(transcript);
  });

  useSpeechRecognitionEvent("end", () => setListening(false));
  useSpeechRecognitionEvent("error", () => setListening(false));

  // ── Start voice input ──────────────────────────────────────────────────
  async function startListening() {
    if (!ExpoSpeechRecognitionModule) {
      alert("குரல் உள்ளீடு native build-ல் மட்டுமே வேலை செய்யும். APK install செய்க.");
      return;
    }
    try {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) return;
      setListening(true);
      setInput("");
      ExpoSpeechRecognitionModule.start({
        lang: voiceLang,
        interimResults: true,
        continuous: false,
      });
    } catch { setListening(false); }
  }

  function stopListening() {
    if (ExpoSpeechRecognitionModule) ExpoSpeechRecognitionModule.stop();
    setListening(false);
  }

  // ── TTS — speak answer ─────────────────────────────────────────────────
  async function speakAnswer(msgId, text) {
    if (speaking === msgId) {
      Speech.stop();
      setSpeaking(null);
      return;
    }
    setSpeaking(msgId);
    const clean = text.replace(/\*\*/g, "").replace(/###/g, "").replace(/##/g, "").replace(/💡/g, "").replace(/→/g, " arrow ");
    const isEnglish = msgId.endsWith("_en");
    Speech.speak(clean, {
      language: isEnglish ? "en-GB" : "ta-IN",
      pitch: 1.0,
      rate: 0.85,
      onDone: () => setSpeaking(null),
      onError: () => setSpeaking(null),
    });
  }

  // ── Translation ────────────────────────────────────────────────────────
  async function translateToEnglish(msgId, text) {
    if (translations[msgId]) return;
    setTranslating(t => ({ ...t, [msgId]: true }));
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKeyRef.current}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Translate this Tamil educational answer to clear English. Keep technical terms, equations, structure. Only return the translation:\n\n${text}` }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        }
      );
      const data = await res.json();
      const translated = data.candidates?.[0]?.content?.parts?.[0]?.text || "Translation unavailable";
      setTranslations(t => ({ ...t, [msgId]: translated }));
    } catch {
      setTranslations(t => ({ ...t, [msgId]: "Translation unavailable" }));
    } finally {
      setTranslating(t => ({ ...t, [msgId]: false }));
    }
  }

  // ── Send message ───────────────────────────────────────────────────────
  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const displayText = markFilterRef.current ? `[${markFilterRef.current.label}] ${text}` : text;
    const userMsg = { id: Date.now().toString(), role: "user", content: displayText };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setLoading(true);
    setLastQuestion(text);
    onQuestionAsked?.();

    try {
      const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content.replace(/^\[.*?\] /, "") }));
      const reply = await askVidhu(apiMsgs, apiKeyRef.current, studentClass, markFilterRef.current);
      const replyMsg = { id: Date.now().toString() + "a", role: "assistant", content: reply };
      setMsgs(m => [...m, replyMsg]);
      setLastAnswer(reply);
      setOffline(false);
      // Auto-speak if listening was used
      if (listening === false && input === "") speakAnswer(replyMsg.id, reply);
    } catch {
      const reply = getOfflineAnswer(text);
      setMsgs(m => [...m, { id: Date.now().toString() + "o", role: "assistant", content: reply }]);
      setLastAnswer(reply);
      setOffline(true);
    } finally { setLoading(false); }
  }

  // ── Render message ─────────────────────────────────────────────────────
  const renderMsg = ({ item }) => {
    const isUser = item.role === "user";
    const hasFilter = isUser && item.content.startsWith("[");
    const filterLabel = hasFilter ? item.content.match(/^\[(.*?)\]/)?.[1] : null;
    const msgText = hasFilter ? item.content.replace(/^\[.*?\] /, "") : item.content;

    return (
      <View style={s.msgWrap}>
        <View style={[s.msgRow, isUser && s.msgRowUser]}>
          {!isUser && <Text style={s.avatar}>🦉</Text>}
          <View style={[s.bubbleWrap, isUser ? s.bubbleWrapUser : s.bubbleWrapBot]}>
            {filterLabel && <View style={s.filterTag}><Text style={s.filterTagText}>{filterLabel}</Text></View>}
            <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
              {isUser
                ? <Text selectable style={s.bubbleTextUser}>{msgText}</Text>
                : <View>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 }}>
                      <TouchableOpacity
                        style={[s.actionBtn, speaking === item.id && s.actionBtnActive]}
                        onPress={() => speakAnswer(item.id, msgText)}>
                        <Text style={s.actionBtnText}>{speaking === item.id ? "⏹ நிறுத்து" : "🔊 கேள்"}</Text>
                      </TouchableOpacity>
                    </View>
                    <SimpleMarkdown text={msgText} />
                  </View>
              }
            </View>
          </View>
        </View>

        {!isUser && (
          <View style={s.actionRow}>
            {/* Translate button */}
            {!translations[item.id]
              ? <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => translateToEnglish(item.id, msgText)}
                  disabled={!!translating[item.id]}>
                  <Text style={s.actionBtnText}>{translating[item.id] ? "⏳..." : "🇬🇧 English"}</Text>
                </TouchableOpacity>
              : null
            }
          </View>
        )}

        {/* English translation */}
        {!isUser && translations[item.id] && (
          <View style={s.translationBox}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={s.translationLabel}>🇬🇧 English Translation</Text>
              <TouchableOpacity
                style={[s.actionBtn, speaking === item.id + "_en" && s.actionBtnActive]}
                onPress={() => speakAnswer(item.id + "_en", translations[item.id])}>
                <Text style={s.actionBtnText}>{speaking === item.id + "_en" ? "⏹ Stop" : "🔊 Listen"}</Text>
              </TouchableOpacity>
            </View>
            <SimpleMarkdown text={translations[item.id]} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerOwl}>🦉</Text>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>விது</Text>
          <Text style={s.headerStatus}>{offline ? "📴 offline" : "🟢 online"} • {studentClass}ஆம் வகுப்பு</Text>
        </View>
        <TouchableOpacity
          style={[s.filterBtn, showFilters && s.filterBtnActive]}
          onPress={() => setShowFilters(f => !f)}>
          <Text style={[s.filterBtnText, showFilters && s.filterBtnTextActive]}>
            {markFilter ? markFilter.label : "பதில் வகை"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mark filter pills */}
      {showFilters && (
        <View style={s.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
            <TouchableOpacity
              style={[s.filterPill, !markFilter && s.filterPillActive]}
              onPress={() => { setMarkFilter(null); setShowFilters(false); }}>
              <Text style={[s.filterPillText, !markFilter && s.filterPillTextActive]}>ஆசிரியர் பதில்</Text>
            </TouchableOpacity>
            {markScheme.map(scheme => (
              <TouchableOpacity
                key={scheme.marks}
                style={[s.filterPill, markFilter?.marks === scheme.marks && s.filterPillActive]}
                onPress={() => { setMarkFilter(scheme); setShowFilters(false); }}>
                <Text style={[s.filterPillText, markFilter?.marks === scheme.marks && s.filterPillTextActive]}>
                  {scheme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {markFilter && (
        <View style={s.activeFilter}>
          <Text style={s.activeFilterText}>📝 {markFilter.label} வடிவம்</Text>
          <TouchableOpacity onPress={() => setMarkFilter(null)}>
            <Text style={s.activeFilterClear}>✕ நீக்கு</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={m => m.id}
          renderItem={renderMsg}
          contentContainerStyle={s.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={s.loadingRow}>
            <Text style={s.avatar}>🦉</Text>
            <View style={s.bubbleBot}><ActivityIndicator size="small" color={colors.muted} /></View>
          </View>
        )}

        {msgs.length < 3 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.suggestions} contentContainerStyle={s.suggestionsInner}>
            {SUGGESTIONS.map(sg => (
              <TouchableOpacity key={sg} style={s.suggestion} onPress={() => setInput(sg)}>
                <Text style={s.suggestionText}>{sg}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Save button */}
        {lastAnswer !== '' && (
          <TouchableOpacity
            style={s.saveBtn}
            onPress={() => { onSaveReply?.(lastQuestion, lastAnswer, 'Other'); setLastAnswer(''); }}>
            <Text style={s.saveBtnText}>🔖 கடைசி பதிலை சேமி</Text>
          </TouchableOpacity>
        )}

        {/* Input row */}
        <View style={s.inputRow}>
          {/* Voice language toggle */}
          <TouchableOpacity
            style={s.langToggle}
            onPress={() => setVoiceLang(l => l === "ta-IN" ? "en-IN" : "ta-IN")}>
            <Text style={s.langToggleText}>{voiceLang === "ta-IN" ? "தமிழ்" : "EN"}</Text>
          </TouchableOpacity>

          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            placeholder={listening ? "கேட்கிறோம்..." : "விதுவிடம் கேள்..."}
            placeholderTextColor={listening ? colors.terra : colors.muted}
            returnKeyType="send"
            multiline
          />

          {/* Mic button */}
          <TouchableOpacity
            style={[s.micBtn, listening && s.micBtnActive]}
            onPress={listening ? stopListening : startListening}>
            <Text style={s.micBtnText}>{listening ? "⏹" : "🎤"}</Text>
          </TouchableOpacity>

          {/* Send button */}
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]}
            onPress={send}
            disabled={!input.trim() || loading}>
            <Text style={s.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={s.disclaimer}>
        <Text style={s.disclaimerText}>⚠️ AI தவறுகள் நடக்கலாம் — பதில்களை ஆசிரியரிடம் உறுதி செய்க</Text>
        <Text style={s.disclaimerTextEn}>AI can make mistakes — verify all answers with your teacher</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:                 { flex: 1, backgroundColor: colors.cream },
  flex:                 { flex: 1 },
  header:               { backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  headerOwl:            { fontSize: 28 },
  headerInfo:           { flex: 1 },
  headerName:           { fontSize: fontSizes.md, fontWeight: "700", color: colors.white },
  headerStatus:         { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  filterBtn:            { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)" },
  filterBtnActive:      { backgroundColor: colors.gold, borderColor: colors.gold },
  filterBtnText:        { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
  filterBtnTextActive:  { color: colors.white },
  filterRow:            { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: spacing.sm },
  filterScroll:         { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  filterPill:           { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cream },
  filterPillActive:     { backgroundColor: colors.blue, borderColor: colors.blue },
  filterPillText:       { fontSize: fontSizes.sm, color: colors.muted, fontWeight: "600" },
  filterPillTextActive: { color: colors.white },
  activeFilter:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, backgroundColor: colors.goldLight, borderBottomWidth: 1, borderBottomColor: colors.gold },
  activeFilterText:     { fontSize: fontSizes.xs, color: colors.gold, fontWeight: "600" },
  activeFilterClear:    { fontSize: fontSizes.xs, color: colors.terra, fontWeight: "700" },
  list:                 { padding: spacing.lg, paddingBottom: spacing.md },
  msgWrap:              { marginBottom: spacing.md },
  msgRow:               { flexDirection: "row", gap: spacing.sm, alignItems: "flex-end" },
  msgRowUser:           { justifyContent: "flex-end" },
  bubbleWrap:           { maxWidth: "85%" },
  bubbleWrapBot:        { width: "92%", alignSelf: "flex-start" },
  bubbleWrapUser:       { maxWidth: "85%", alignItems: "flex-end" },
  filterTag:            { backgroundColor: colors.goldLight, borderRadius: radii.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: 3, alignSelf: "flex-end" },
  filterTagText:        { fontSize: fontSizes.xs, color: colors.gold, fontWeight: "700" },
  avatar:               { fontSize: 24, marginBottom: 2 },
  bubble:               { padding: spacing.md, borderRadius: radii.lg },
  bubbleBot:            { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: radii.sm },
  bubbleUser:           { backgroundColor: colors.blue, borderBottomRightRadius: radii.sm },
  bubbleTextUser:       { fontSize: fontSizes.base, color: colors.white, lineHeight: 22 },
  actionRow:            { flexDirection: "row", gap: spacing.sm, marginLeft: 36, marginTop: 6 },
  actionBtn:            { backgroundColor: colors.blueLight, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border },
  actionBtnActive:      { backgroundColor: colors.terraLight, borderColor: colors.terra },
  actionBtnText:        { fontSize: fontSizes.xs, color: colors.blue, fontWeight: "600" },
  translateRow:         { marginLeft: 36, marginTop: 6 },
  translationBox:       { marginLeft: 36, marginTop: 6, backgroundColor: colors.blueLight, borderRadius: radii.md, padding: spacing.md },
  translationLabel:     { fontSize: fontSizes.xs, color: colors.blue, fontWeight: "700", marginBottom: 6 },
  loadingRow:           { flexDirection: "row", gap: spacing.sm, alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  suggestions:          { maxHeight: 44 },
  suggestionsInner:     { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: "center" },
  suggestion:           { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, borderWidth: 1, borderColor: colors.blue, backgroundColor: colors.blueLight },
  suggestionText:       { fontSize: fontSizes.sm, color: colors.blue },
  saveBtn:              { marginHorizontal: spacing.md, marginBottom: spacing.xs, backgroundColor: colors.goldLight, borderRadius: radii.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, alignItems: "center", borderWidth: 1, borderColor: colors.gold },
  saveBtnText:          { fontSize: fontSizes.sm, color: colors.gold, fontWeight: "700" },
  inputRow:             { flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white, alignItems: "flex-end" },
  langToggle:           { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.blueLight, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  langToggleText:       { fontSize: 10, color: colors.blue, fontWeight: "700" },
  input:                { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, fontSize: fontSizes.base, color: colors.ink, maxHeight: 100 },
  micBtn:               { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.blueLight, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.blue },
  micBtnActive:         { backgroundColor: colors.terra, borderColor: colors.terra },
  micBtnText:           { fontSize: 20 },
  sendBtn:              { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  sendBtnDisabled:      { backgroundColor: colors.border },
  sendBtnText:          { color: colors.white, fontSize: fontSizes.lg, fontWeight: "700" },
  disclaimer:           { backgroundColor: colors.terraLight, paddingVertical: spacing.xs, paddingHorizontal: spacing.lg, alignItems: "center", borderTopWidth: 1, borderTopColor: "#E8C4B8" },
  disclaimerText:       { fontSize: 10, color: colors.terra, fontWeight: "600", textAlign: "center" },
  disclaimerTextEn:     { fontSize: 10, color: colors.terra, opacity: 0.7, textAlign: "center" },
});
