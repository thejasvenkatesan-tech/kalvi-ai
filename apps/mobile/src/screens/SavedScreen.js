import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback,
  StyleSheet, SafeAreaView, Share, Alert
} from "react-native";
import { colors, spacing, radii, fontSizes } from "../constants/tokens";

const SUBJECT_COLORS = {
  Science:  { bg: "#E1F0E9", color: "#2D7A5F" },
  Maths:    { bg: "#E6EEF8", color: "#1B3A6B" },
  Tamil:    { bg: "#FDF3E0", color: "#E8A020" },
  Social:   { bg: "#FAEAE4", color: "#C45C3A" },
  English:  { bg: "#E6EEF8", color: "#1B3A6B" },
  AI:       { bg: "#E1F0E9", color: "#2D7A5F" },
  Other:    { bg: "#F7F3ED", color: "#6B6560" },
};

function generateHTML(replies, studentName, rollNumber) {
  const items = replies.map(r => `
    <div class="card">
      <div class="meta">
        <span class="subject">${r.subject || 'Other'}</span>
        <span class="date">${new Date(r.savedAt).toLocaleDateString('en-IN')}</span>
      </div>
      <div class="question">❓ ${r.question}</div>
      <div class="answer">${r.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>கல்வி.AI — சேமித்த பதில்கள்</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; background: #F7F3ED; }
  h1 { color: #1B3A6B; font-size: 22px; margin-bottom: 4px; }
  .info { color: #6B6560; font-size: 14px; margin-bottom: 24px; }
  .card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #E2DDD7; page-break-inside: avoid; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .subject { background: #E6EEF8; color: #1B3A6B; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
  .date { color: #6B6560; font-size: 12px; }
  .question { color: #1B3A6B; font-weight: bold; margin-bottom: 10px; font-size: 15px; }
  .answer { color: #1A1612; line-height: 1.6; font-size: 14px; border-top: 1px solid #E2DDD7; padding-top: 10px; }
  @media print { body { background: white; } }
</style>
</head>
<body>
<h1>🦉 கல்வி.AI — சேமித்த பதில்கள்</h1>
<div class="info">மாணவர்: ${studentName} | Roll No: ${rollNumber} | ${new Date().toLocaleDateString('en-IN')}</div>
${items}
</body>
</html>`;
}

export default function SavedScreen({ savedReplies, setSavedReplies, student }) {
  const [expanded, setExpanded]     = useState(null);
  const [filter, setFilter]         = useState("All");
  const [selecting, setSelecting]   = useState(false);
  const [selected, setSelected]     = useState([]);

  const subjects = ["All", ...new Set(savedReplies.map(r => r.subject || "Other"))];
  const filtered = filter === "All" ? savedReplies : savedReplies.filter(r => (r.subject || "Other") === filter);

  function toggleSelect(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function exitSelectMode() {
    setSelecting(false);
    setSelected([]);
  }

  function deleteSelected() {
    Alert.alert(
      "நீக்கவா?",
      `${selected.length} பதில்கள் நீக்கப்படும். உறுதியா?`,
      [
        { text: "இல்லை", style: "cancel" },
        {
          text: "நீக்கு", style: "destructive",
          onPress: () => {
            setSavedReplies(r => r.filter(x => !selected.includes(x.id)));
            exitSelectMode();
          }
        }
      ]
    );
  }

  async function shareSelected() {
    const toShare = selected.length > 0
      ? savedReplies.filter(r => selected.includes(r.id))
      : savedReplies;

    const html = generateHTML(
      toShare,
      student?.name || "மாணவர்",
      student?.roll || "—"
    );

    try {
      await Share.share({
        title: "கல்வி.AI — சேமித்த பதில்கள்",
        message: html,
      });
    } catch (e) {
      Alert.alert("பகிர முடியவில்லை", e.message);
    }
    exitSelectMode();
  }

  if (savedReplies.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🔖</Text>
          <Text style={s.emptyTitle}>இன்னும் எதுவும் சேமிக்கவில்லை</Text>
          <Text style={s.emptySub}>விதுவின் பதில்களை சேமிக்க "சேமி" பொத்தானை அழுத்துங்கள்</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>

      {/* Selection mode toolbar */}
      {selecting && (
        <View style={s.toolbar}>
          <TouchableOpacity onPress={exitSelectMode}>
            <Text style={s.toolbarCancel}>✕ ரத்து</Text>
          </TouchableOpacity>
          <Text style={s.toolbarCount}>{selected.length} தேர்வு</Text>
          <View style={s.toolbarActions}>
            {selected.length > 0 && (
              <>
                <TouchableOpacity style={s.toolbarBtn} onPress={shareSelected}>
                  <Text style={s.toolbarBtnText}>📤 பகிர்</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.toolbarBtn, s.toolbarBtnDelete]} onPress={deleteSelected}>
                  <Text style={[s.toolbarBtnText, s.toolbarBtnDeleteText]}>🗑 நீக்கு</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>சேமித்த பதில்கள்</Text>
            <Text style={s.sub}>{savedReplies.length} பதில்கள்</Text>
          </View>
          <View style={s.headerActions}>
            {!selecting && (
              <>
                <TouchableOpacity style={s.headerBtn} onPress={shareSelected}>
                  <Text style={s.headerBtnText}>📤</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.headerBtn} onPress={() => setSelecting(true)}>
                  <Text style={s.headerBtnText}>☑️</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Subject filter */}
        {subjects.length > 2 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterWrap} contentContainerStyle={s.filterScroll}>
            {subjects.map(sub => (
              <TouchableOpacity
                key={sub}
                style={[s.filterPill, filter === sub && s.filterPillActive]}
                onPress={() => setFilter(sub)}>
                <Text style={[s.filterText, filter === sub && s.filterTextActive]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Cards */}
        {filtered.map(reply => {
          const subjectStyle = SUBJECT_COLORS[reply.subject || "Other"] || SUBJECT_COLORS.Other;
          const isExpanded   = expanded === reply.id;
          const isSelected   = selected.includes(reply.id);
          const date         = new Date(reply.savedAt).toLocaleDateString("ta-IN");

          return (
            <TouchableWithoutFeedback
              key={reply.id}
              onPress={() => {
                if (selecting) { toggleSelect(reply.id); return; }
                setExpanded(isExpanded ? null : reply.id);
              }}
              onLongPress={() => {
                if (!selecting) { setSelecting(true); toggleSelect(reply.id); }
              }}>
              <View style={[s.replyCard, isSelected && s.replyCardSelected]}>

                {/* Selection checkbox */}
                {selecting && (
                  <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
                    {isSelected && <Text style={s.checkmark}>✓</Text>}
                  </View>
                )}

                {/* Header row */}
                <View style={s.replyHeader}>
                  <View style={[s.subjectTag, { backgroundColor: subjectStyle.bg }]}>
                    <Text style={[s.subjectTagText, { color: subjectStyle.color }]}>
                      {reply.subject || "Other"}
                    </Text>
                  </View>
                  <Text style={s.replyDate}>{date}</Text>
                  {!selecting && <Text style={s.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>}
                </View>

                {/* Question */}
                <Text selectable style={s.replyQuestion} numberOfLines={isExpanded ? undefined : 2}>
                  ❓ {reply.question}
                </Text>

                {/* Answer */}
                {isExpanded && (
                  <View style={s.replyAnswerWrap}>
                    <View style={s.replyDivider} />
                    <Text style={s.replyAnswerLabel}>🦉 விதுவின் பதில்:</Text>
                    <Text selectable style={s.replyAnswer}>
                      {reply.answer.replace(/\*\*/g, "").replace(/###/g, "").replace(/##/g, "")}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}

        <Text style={s.hint}>💡 Long-press ஒரு பதிலை தேர்வு செய்யவும்</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: colors.cream },
  toolbar:             { backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", padding: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.md },
  toolbarCancel:       { color: colors.white, fontSize: fontSizes.sm, fontWeight: "600" },
  toolbarCount:        { flex: 1, color: colors.white, fontSize: fontSizes.base, fontWeight: "700", textAlign: "center" },
  toolbarActions:      { flexDirection: "row", gap: spacing.sm },
  toolbarBtn:          { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  toolbarBtnDelete:    { backgroundColor: colors.terra },
  toolbarBtnText:      { color: colors.white, fontSize: fontSizes.sm, fontWeight: "600" },
  toolbarBtnDeleteText:{ color: colors.white },
  scroll:              { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header:              { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  headerActions:       { flexDirection: "row", gap: spacing.sm },
  headerBtn:           { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.sm, borderWidth: 1, borderColor: colors.border },
  headerBtnText:       { fontSize: 18 },
  empty:               { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxxl },
  emptyIcon:           { fontSize: 56, marginBottom: spacing.lg },
  emptyTitle:          { fontSize: fontSizes.lg, fontWeight: "700", color: colors.ink, textAlign: "center", marginBottom: spacing.sm },
  emptySub:            { fontSize: fontSizes.base, color: colors.muted, textAlign: "center", lineHeight: 22 },
  title:               { fontSize: fontSizes.xl, fontWeight: "800", color: colors.blue, marginBottom: 4 },
  sub:                 { fontSize: fontSizes.sm, color: colors.muted },
  filterWrap:          { marginBottom: spacing.md },
  filterScroll:        { gap: spacing.sm, paddingRight: spacing.lg },
  filterPill:          { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  filterPillActive:    { backgroundColor: colors.blue, borderColor: colors.blue },
  filterText:          { fontSize: fontSizes.sm, color: colors.muted, fontWeight: "600" },
  filterTextActive:    { color: colors.white },
  replyCard:           { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  replyCardSelected:   { borderColor: colors.blue, borderWidth: 2, backgroundColor: colors.blueLight },
  checkbox:            { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  checkboxSelected:    { backgroundColor: colors.blue, borderColor: colors.blue },
  checkmark:           { color: colors.white, fontSize: 13, fontWeight: "700" },
  replyHeader:         { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  subjectTag:          { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radii.full },
  subjectTagText:      { fontSize: fontSizes.xs, fontWeight: "700" },
  replyDate:           { fontSize: fontSizes.xs, color: colors.muted, flex: 1 },
  expandIcon:          { fontSize: fontSizes.xs, color: colors.muted },
  replyQuestion:       { fontSize: fontSizes.base, color: colors.ink, lineHeight: 22, fontWeight: "500" },
  replyDivider:        { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  replyAnswerWrap:     {},
  replyAnswerLabel:    { fontSize: fontSizes.sm, fontWeight: "700", color: colors.blue, marginBottom: spacing.sm },
  replyAnswer:         { fontSize: fontSizes.base, color: colors.ink, lineHeight: 24 },
  hint:                { fontSize: fontSizes.xs, color: colors.muted, textAlign: "center", marginTop: spacing.md },
});
