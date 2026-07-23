// கல்வி.AI — Vidhu AI Helper (Mobile)

const GEMINI_MODEL = "gemini-1.5-flash";

const VIDHU_SYSTEM_PROMPT = `நீ விது — கல்வி.AI-யின் AI நண்பன். நீ ஒரு அறிவாளியான, அன்பான ஆந்தை.
10 முதல் 14 வயதுள்ள தமிழ் அரசு பள்ளி மாணவர்களுக்கு AI பற்றி கற்றுக்கொடுக்கிறாய்.

உன் குணாதிசயங்கள்:
- தமிழில் மட்டுமே பேசு
- எப்போதும் அண்ணன் அல்லது அக்கா மாதிரி பேசு
- AI English வார்த்தைகளை இயல்பாக சொல்: "இதை ஆங்கிலத்தில் 'Algorithm' என்று சொல்வார்கள்"
- சிறிய வெற்றிகளை கொண்டாடு: "அருமை!", "சூப்பர்!"
- AI literacy மட்டுமே பேசு
- பதில்கள் 3–5 வரிகள் மட்டும்
- ஒவ்வொரு பதிலிலும் ஒரு கேள்வி கேள்`;

const OFFLINE_QA = [
  {
    keywords: ["ai என்ன", "what is ai", "ai பத்தி"],
    answer: "AI என்பது 'Artificial Intelligence' — இதை ஆங்கிலத்தில் அப்படி சொல்வார்கள். உன் போனின் autocomplete, Google Translate — எல்லாம் AI தான்! உன் வீட்டில் AI பயன்படுத்தும் ஒன்று கண்டுபிடிக்க முடியுமா? 🦉"
  },
  {
    keywords: ["algorithm"],
    answer: "Algorithm — இதை ஆங்கிலத்தில் 'Algorithm' என்று சொல்வார்கள் — கணினிக்கு கொடுக்கும் step-by-step வழிமுறை. சமையல் குறிப்பு மாதிரி! உன் பள்ளியில் ஏதாவது step-by-step process இருக்கிறதா? 🦉"
  },
  {
    keywords: ["prompt"],
    answer: "Prompt என்பது — இதை ஆங்கிலத்தில் 'Prompt' என்று சொல்வார்கள் — நாம் AI-யிடம் கேட்கும் கேள்வி. நல்ல Prompt கொடுத்தால், நல்ல பதில் கிடைக்கும்! 🦉"
  },
  {
    keywords: ["data", "தரவு"],
    answer: "Data என்பது — இதை ஆங்கிலத்தில் 'Data' என்று சொல்வார்கள் — தகவல்கள். AI இந்த data பார்த்து கற்றுக்கொள்கிறது. உன் பள்ளியில் என்ன data சேகரிக்கிறார்கள்? 🦉"
  },
];

export function getOfflineAnswer(question) {
  const lower = question.toLowerCase();
  for (const item of OFFLINE_QA) {
    if (item.keywords.some(kw => lower.includes(kw))) return item.answer;
  }
  return "இப்போது internet இல்லை. Connection வந்தால் விரிவாக சொல்கிறேன். AI பற்றி உனக்கு என்ன தெரியும்? 🦉";
}

export async function askVidhu(messages, apiKey) {
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
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "மன்னிக்கவும், மீண்டும் கேட்கவும். 🦉";
}
