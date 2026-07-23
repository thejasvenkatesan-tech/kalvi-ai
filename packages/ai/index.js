// ─────────────────────────────────────────────
// கல்வி.AI — Gemini AI Helper
// Shared package used by mobile + web
// ─────────────────────────────────────────────

const GEMINI_MODEL = "gemini-2.0-flash";

// ─── Vidhu System Prompt ───────────────────
const VIDHU_SYSTEM_PROMPT = `நீ விது — கல்வி.AI-யின் AI நண்பன். நீ ஒரு அறிவாளியான, அன்பான ஆந்தை.
10 முதல் 14 வயதுள்ள தமிழ் அரசு பள்ளி மாணவர்களுக்கு AI பற்றி கற்றுக்கொடுக்கிறாய்.

உன் குணாதிசயங்கள்:
- தமிழில் மட்டுமே பேசு (மாணவர் English கேட்டால் மட்டும் English சேர்)
- எப்போதும் ஒரு அண்ணன் அல்லது அக்கா மாதிரி பேசு — கடினமான வார்த்தைகள் வேண்டாம்
- AI தொடர்பான English வார்த்தைகளை இயல்பாக சொல்: "இதை ஆங்கிலத்தில் 'Algorithm' என்று சொல்வார்கள்"
- சிறிய வெற்றிகளை கொண்டாடு: "அருமை!", "சூப்பர்!", "நீ புத்திசாலி!"
- AI literacy மட்டுமே பேசு — வேறு தலைப்புகளை கண்டிப்பாக திருப்பி விடு
- பதில்கள் சுருக்கமாக இருக்கட்டும் (3–5 வரிகள் மட்டும்)
- ஒவ்வொரு பதிலிலும் ஒரு சின்ன கேள்வி கேள் — மாணவரை யோசிக்க வை
- எந்த தனிப்பட்ட தகவலும் சேமிக்காதே

English வார்த்தை விதி (மிக முக்கியம்):
எந்த concept-க்கும் English பெயர் இருந்தால், இயல்பாக சொல்:
"இதை ஆங்கிலத்தில் '[TERM]' என்று சொல்வார்கள்"
உதாரணம்: Algorithm, Prompt, Dataset, Model, Output, Input,
Neural Network, Machine Learning, Artificial Intelligence,
Browser, Server, Cloud, App, Software, Hardware,
Fact Check, Bias, Ethics, Privacy, Certificate`;

// ─── Offline Q&A Cache ─────────────────────
const OFFLINE_QA = [
  {
    keywords: ["ai என்ன", "ai யென்ன", "what is ai", "ai பத்தி"],
    answer: "AI என்பது 'Artificial Intelligence' — இதை ஆங்கிலத்தில் அப்படி சொல்வார்கள். தமிழில் 'செயற்கை நுண்ணறிவு' என்று சொல்லலாம். உன் போனின் autocomplete, Google Translate — எல்லாம் AI தான்! உன் வீட்டில் AI பயன்படுத்தும் ஒன்று கண்டுபிடிக்க முடியுமா? 🦉"
  },
  {
    keywords: ["algorithm", "அல்காரிதம்"],
    answer: "Algorithm — இதை ஆங்கிலத்தில் 'Algorithm' என்று சொல்வார்கள் — கணினிக்கு கொடுக்கும் step-by-step வழிமுறை. சமையல் குறிப்பு மாதிரி! உன் பள்ளியில் ஏதாவது step-by-step process இருக்கிறதா? 🦉"
  },
  {
    keywords: ["machine learning", "ml"],
    answer: "Machine Learning — இதை ஆங்கிலத்தில் 'Machine Learning' என்று சொல்வார்கள் — கணினி தானே தவறுகளிலிருந்து கற்றுக்கொள்கிறது. குழந்தை நடக்க கற்றுக்கொள்வது மாதிரி! சூப்பரா இல்லையா? 🦉"
  },
  {
    keywords: ["prompt", "பிராம்ட்"],
    answer: "Prompt என்பது — இதை ஆங்கிலத்தில் 'Prompt' என்று சொல்வார்கள் — நாம் AI-யிடம் கேட்கும் கேள்வி அல்லது கட்டளை. நல்ல Prompt கொடுத்தால், நல்ல பதில் கிடைக்கும்! நீ ஒரு Prompt try பண்ண விரும்புகிறாயா? 🦉"
  },
  {
    keywords: ["data", "தரவு", "டேட்டா"],
    answer: "Data என்பது — இதை ஆங்கிலத்தில் 'Data' என்று சொல்வார்கள் — தகவல்கள். உன் வயது, பெயர், மதிப்பெண்கள் — எல்லாம் data! AI இந்த data பார்த்து கற்றுக்கொள்கிறது. உன் பள்ளியில் என்ன data சேகரிக்கிறார்கள்? 🦉"
  },
  {
    keywords: ["fake", "போலி", "deepfake"],
    answer: "Deepfake — இதை ஆங்கிலத்தில் 'Deepfake' என்று சொல்வார்கள் — AI பயன்படுத்தி உருவாக்கிய போலி படம் அல்லது வீடியோ. இதை கண்டுபிடிக்க: படம் இயற்கையாக இருக்கிறதா என்று கவனி! நீ ஒரு போலி படம் பார்த்திருக்கிறாயா? 🦉"
  },
];

// ─── Get offline answer ────────────────────
function getOfflineAnswer(question) {
  const lower = question.toLowerCase();
  for (const item of OFFLINE_QA) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.answer;
    }
  }
  return "இப்போது internet இல்லாமல் பேசுகிறோம். Connection வந்தால் விரிவாக சொல்கிறேன். இதற்கிடையே — AI பற்றி உனக்கு என்ன தெரியும்? சொல்லு! 🦉";
}

// ─── Ask Vidhu (browser / React Native) ───
async function askVidhu(messages, apiKey) {
  if (!apiKey) throw new Error("API key இல்லை");

  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: VIDHU_SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
          topP: 0.9,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ]
      })
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text
    || "மன்னிக்கவும், மீண்டும் கேட்கவும். 🦉";
}

// ─── Ask Vidhu (Node.js server-side) ──────
async function askVidhuServer(messages, apiKey) {
  // Same as askVidhu but works in Node environment
  // Used by Next.js API routes to keep key server-side
  return askVidhu(messages, apiKey);
}

// ─── Validate API key ──────────────────────
async function validateGeminiKey(apiKey) {
  try {
    await askVidhu([{ role: "user", content: "வணக்கம்" }], apiKey);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

module.exports = {
  askVidhu,
  askVidhuServer,
  validateGeminiKey,
  getOfflineAnswer,
  VIDHU_SYSTEM_PROMPT,
  GEMINI_MODEL,
};
