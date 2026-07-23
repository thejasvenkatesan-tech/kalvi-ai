import { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";
import { askVidhu, getOfflineAnswer } from "../utils/vidhu";

const SUGGESTIONS = [
  "AI என்றால் என்ன?",
  "Prompt என்றால் என்ன?",
  "Machine Learning சொல்லு",
];

export default function VidhuScreen({ apiKey, activeMission, onMissionComplete, onFirstChat }) {
  const [msgs, setMsgs] = useState([
    {
      id: "0", role: "assistant",
      content: "வணக்கம்! நான் விது 🦉\n\nAI பற்றி என்னிடம் எதுவும் கேட்கலாம் — தமிழில்!\n\nென்ன தெரிந்துகொள்ள விரும்புகிறாய்?"
    }
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [chatted, setChatted] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    if (activeMission?.prompt) setInput(activeMission.prompt);
  }, [activeMission]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setLoading(true);

    if (!chatted) { onFirstChat?.(); setChatted(true); }

    try {
      const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const reply = await askVidhu(apiMsgs, apiKey);
      setMsgs(m => [...m, { id: Date.now().toString() + "a", role: "assistant", content: reply }]);
      setOffline(false);
      if (activeMission) onMissionComplete?.(activeMission.id);
    } catch {
      const reply = getOfflineAnswer(text);
      setMsgs(m => [...m, { id: Date.now().toString() + "o", role: "assistant", content: reply }]);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }

  function renderMsg({ item }) {
    const isUser = item.role === "user";
    return (
      <View style={[s.msgRow, isUser && s.msgRowUser]}>
        {!isUser && <Text style={s.avatar}>🦉</Text>}
        <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
          <Text style={[s.bubbleText, isUser && s.bubbleTextUser]}>{item.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerOwl}>🦉</Text>
        <View>
          <Text style={s.headerName}>விது</Text>
          <Text style={s.headerStatus}>{offline ? "📴 offline mode" : "🟢 online"}</Text>
        </View>
      </View>

      {/* Mission banner */}
      {activeMission && (
        <View style={s.missionBanner}>
          <Text style={s.missionBannerText}>🎯 பணி: {activeMission.title}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={m => m.id}
          renderItem={renderMsg}
          contentContainerStyle={s.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Loading */}
        {loading && (
          <View style={s.loadingRow}>
            <Text style={s.avatar}>🦉</Text>
            <View style={s.bubbleBot}>
              <ActivityIndicator size="small" color={colors.muted} />
            </View>
          </View>
        )}

        {/* Suggestions */}
        {msgs.length < 3 && (
          <View style={s.suggestions}>
            {SUGGESTIONS.map(sg => (
              <TouchableOpacity key={sg} style={s.suggestion} onPress={() => setInput(sg)}>
                <Text style={s.suggestionText}>{sg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            placeholder="விதுவிடம் கேள்..."
            placeholderTextColor={colors.muted}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]}
            onPress={send}
            disabled={!input.trim() || loading}>
            <Text style={s.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.cream },
  flex:              { flex: 1 },
  header:            { backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  headerOwl:         { fontSize: 28 },
  headerName:        { fontSize: fontSizes.md, fontWeight: "700", color: colors.white },
  headerStatus:      { fontSize: fontSizes.xs, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  missionBanner:     { backgroundColor: colors.goldLight, padding: spacing.sm, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.gold },
  missionBannerText: { fontSize: fontSizes.sm, color: colors.gold, fontWeight: "600" },
  list:              { padding: spacing.lg, gap: spacing.md },
  msgRow:            { flexDirection: "row", gap: spacing.sm, alignItems: "flex-end" },
  msgRowUser:        { justifyContent: "flex-end" },
  avatar:            { fontSize: 24, marginBottom: 2 },
  bubble:            { maxWidth: "78%", padding: spacing.md, borderRadius: radii.lg },
  bubbleBot:         { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: radii.sm },
  bubbleUser:        { backgroundColor: colors.blue, borderBottomRightRadius: radii.sm },
  bubbleText:        { fontSize: fontSizes.base, color: colors.ink, lineHeight: 22 },
  bubbleTextUser:    { color: colors.white },
  loadingRow:        { flexDirection: "row", gap: spacing.sm, alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  suggestions:       { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md, paddingHorizontal: spacing.lg },
  suggestion:        { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, borderWidth: 1, borderColor: colors.blue, backgroundColor: colors.blueLight },
  suggestionText:    { fontSize: fontSizes.sm, color: colors.blue },
  inputRow:          { flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  input:             { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, fontSize: fontSizes.base, color: colors.ink, maxHeight: 100 },
  sendBtn:           { width: 44, height: 44, borderRadius: radii.full, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  sendBtnDisabled:   { backgroundColor: colors.border },
  sendBtnText:       { color: colors.white, fontSize: fontSizes.lg, fontWeight: "700" },
});
