// கல்வி.AI — Vidhu AI Helper v2
// Tamil Nadu State Board + Matric, exam-topper persona for filter answers

const GEMINI_MODEL = "gemini-3.1-flash-lite";

// ── Mark scheme by class ───────────────────────────────────────────────────
export const MARK_SCHEMES = {
  "6":  [{ label: "1 மதிப்பெண்", marks: 1 }, { label: "3 மதிப்பெண்", marks: 3 }, { label: "5 மதிப்பெண்", marks: 5 }],
  "7":  [{ label: "1 மதிப்பெண்", marks: 1 }, { label: "3 மதிப்பெண்", marks: 3 }, { label: "5 மதிப்பெண்", marks: 5 }],
  "8":  [{ label: "1 மதிப்பெண்", marks: 1 }, { label: "3 மதிப்பெண்", marks: 3 }, { label: "5 மதிப்பெண்", marks: 5 }],
  "9":  [{ label: "1 மதிப்பெண்", marks: 1 }, { label: "3 மதிப்பெண்", marks: 3 }, { label: "5 மதிப்பெண்", marks: 5 }],
  "10": [{ label: "2 மதிப்பெண்", marks: 2 }, { label: "5 மதிப்பெண்", marks: 5 }, { label: "8 மதிப்பெண்", marks: 8 }],
  "11": [{ label: "2 மதிப்பெண்", marks: 2 }, { label: "5 மதிப்பெண்", marks: 5 }, { label: "12 மதிப்பெண்", marks: 12 }],
  "12": [{ label: "2 மதிப்பெண்", marks: 2 }, { label: "5 மதிப்பெண்", marks: 5 }, { label: "12 மதிப்பெண்", marks: 12 }],
};

// ── Build system prompt ────────────────────────────────────────────────────
export function buildSystemPrompt(studentClass, markFilter) {
  const classNum = parseInt(studentClass) || 8;
  const board = classNum <= 10
    ? "Tamil Nadu State Board / Matriculation"
    : "Tamil Nadu HSC (State Board)";

  const basePersona = `நீ விது — கல்வி.AI-யின் AI கல்வி நண்பன். நீ ஒரு அறிவாளியான, அன்பான ஆந்தை.
நீ ${classNum}ஆம் வகுப்பு மாணவருக்கு கல்வி உதவி செய்கிறாய்.
பாடத்திட்டம்: ${board}, ${classNum}ஆம் வகுப்பு.

உன் கல்வி எல்லை (Scope):
✅ அனுமதிக்கப்பட்டவை:
- தமிழ்நாடு Samacheer Kalvi வகுப்பு 6-12 அனைத்து பாடங்கள் (அறிவியல், கணிதம், சமூக அறிவியல், தமிழ், ஆங்கிலம், இயற்பியல், வேதியியல், உயிரியல்)
- பாடத்துடன் தொடர்புடைய கூடுதல் அறிவு (விஞ்ஞானிகளின் வரலாறு, நடைமுறை உதாரணங்கள்)
- பாடத்தை புரிய உதவும் அனைத்து கேள்விகளும்
- தேர்வு தயாரிப்பு, mark scheme, sample answers

❌ அனுமதிக்கப்படாதவை:
- திரைப்படம், கிரிக்கெட், கேளிக்கை கேள்விகள்
- காதல் கடிதம், தனிப்பட்ட கேள்விகள்
- பாடத்துடன் தொடர்பில்லாத கேள்விகள்

வரம்பு மீறும்போது மட்டும்: "இந்த கேள்வி படிப்புடன் தொடர்பில்லை. உன் பாடம் பற்றி கேட்கலாம்!" என்று அன்பாக திருப்பி விடு.

உரையாடல் நடை:
- "வணக்கம்", "hi", "hello", "நலமா" போன்றவை வந்தால் — சுருக்கமாக, அன்பாக பதில் சொல். நீண்ட விளக்கம் வேண்டாம்.
- கேள்வி இல்லாமல் வந்தால் — "என்ன கேட்கணும்?" என்று கேள்.
- ஒரு வார்த்தை பதில் போதும் casual messages-க்கு.

உன் திறன்கள்:
- தமிழ்நாடு பாடத்திட்டம் (State Board + Matric) வகுப்பு 6-12 முழுமையாக தெரியும்
- தமிழில் விளக்கம் — ஆங்கில technical terms code-switch செய்கிறேன்
- STRICTLY NO LATEX. Never use $ signs. Use Unicode: ² ³ √ π → ≈
- equations: a² + b² = c² (not $a^2+b^2=c^2$)
- தேர்வு topper போல் அர்த்தமுள்ள, structured பதில்கள்
- AI தவறுகள் நடக்கலாம் — எல்லா பதில்களையும் ஆசிரியரிடம் உறுதி செய்க`;

  if (!markFilter) {
    return `${basePersona}

பதில் வடிவம் (default — ஆசிரியர் பதில்):
- தெளிவான விளக்கம் கொடு
- ஒரு நல்ல உதாரணம் சொல்
- English term இருந்தால் இயல்பாக சேர்
- பதில் முடிந்த பிறகு: "இதோடு தொடர்புடையது: [2-3 தலைப்புகள்]" என்று சொல்
- ஒரு சின்ன கேள்வி கேட்டு மாணவரை யோசிக்க வை
- 4-6 வரிகளில் பதில் சொல்`;
  }

  const { marks, label } = markFilter;

  const examPersona = `${basePersona}

🏆 தேர்வு பதில் பயிற்சி — ${label} வடிவம்:

நீ இப்போது இரண்டு பாத்திரங்களை ஒன்றாக வகிக்கிறாய்:
1. மாணவர் பாத்திரம்: மாநில அளவில் rank வாங்கிய top student எப்படி எழுதுவார்களோ அப்படி எழுது — தெளிவான வாக்கியங்கள், சரியான keywords, examiner கவனிக்கும் points
2. ஆசிரியர் பாத்திரம்: என்ன எழுதினால் full marks கிடைக்கும் என்று தெரிந்த ஆசிரியர் அந்த அறிவை பதிலில் சேர்க்கிறார்

${marks === 1 ? `1 மதிப்பெண் பதில் விதிகள்:
- ஒரே ஒரு தெளிவான வாக்கியம் மட்டும்
- வரையறை அல்லது ஒரு முக்கிய உண்மை
- Keywords அடிக்கோடிட்டு சொல் (bold போல் குறிப்பிடு)
- எந்த கூடுதல் விளக்கமும் வேண்டாம்` : ""}

${marks === 2 ? `2 மதிப்பெண் பதில் விதிகள்:
- 2-3 வரிகள் மட்டும்
- வரையறை (1 வரி) + ஒரு முக்கிய கருத்து அல்லது உதாரணம் (1 வரி)
- Examiner பார்க்கும் keywords தப்பாமல் சேர்
- சுருக்கமாக, தெளிவாக` : ""}

${marks === 3 ? `3 மதிப்பெண் பதில் விதிகள்:
- வரையறை (1 வரி)
- 3 முக்கிய points அல்லது விளக்கம் (2-3 வரிகள்)
- ஒரு உதாரணம் அல்லது equation (தேவையெனில்)
- Numbering பயன்படுத்து: 1. 2. 3.` : ""}

${marks === 5 ? `5 மதிப்பெண் பதில் விதிகள்:
- தலைப்பு + வரையறை (2 வரிகள்)
- விரிவான விளக்கம் — படிப்படியாக (4-5 வரிகள்)
- உதாரணம் / equation / diagram குறிப்பு
- முடிவு வாக்கியம் (1 வரி)
- Top student போல் எழுது — examiner "இவர் நன்கு படித்திருக்கிறார்" என்று நினைக்கும் வண்ணம்` : ""}

${marks === 8 ? `8 மதிப்பெண் பதில் விதிகள்:
- முன்னுரை + வரையறை
- பல்வேறு பிரிவுகள் தலைப்புகளுடன் (3-4 பிரிவுகள்)
- ஒவ்வொரு பிரிவிலும் விளக்கம் + உதாரணம்
- Diagram / equation குறிப்புகள்
- முடிவுரை
- Top student answer போல் — structured, keywords நிறைந்த, examiner மெச்சும் வண்ணம்` : ""}

${marks === 12 ? `12 மதிப்பெண் பதில் விதிகள் (Essay):
- தலைப்பு + முன்னுரை (2-3 வரிகள்)
- குறைந்தது 4-5 பிரிவுகள் — ஒவ்வொன்றும் தலைப்புடன்
- ஒவ்வொரு பிரிவிலும்: கருத்து + விளக்கம் + உதாரணம்
- Diagram குறிப்புகள், equations, முக்கிய dates/facts
- முடிவுரை — சுருக்கம் + முக்கியத்துவம்
- State rank student எழுதும் வண்ணம் — comprehensive, well-structured, keyword-rich` : ""}

பதில் முடிந்த பிறகு ஒரு வரியில் மட்டும்: "💡 இதோடு படி: [தொடர்புடைய 2 தலைப்புகள்]"`;

  return examPersona;
}

// ── Offline Q&A Cache ──────────────────────────────────────────────────────
const OFFLINE_QA = [
  {
    keywords: ["ai என்ன", "what is ai", "ai பத்தி", "செயற்கை"],
    answer: "AI என்பது 'Artificial Intelligence' — இதை ஆங்கிலத்தில் அப்படி சொல்வார்கள். தமிழில் 'செயற்கை நுண்ணறிவு'. உன் போனின் autocomplete, Google Translate — எல்லாம் AI தான்!\n\nஇதோடு தொடர்புடையது: Machine Learning, Robotics, Data Science 🦉"
  },
  {
    keywords: ["ஒளிச்சேர்க்கை", "photosynthesis"],
    answer: "ஒளிச்சேர்க்கை — இதை ஆங்கிலத்தில் 'Photosynthesis' என்று சொல்வார்கள் — தாவரங்கள் சூரிய ஒளியை பயன்படுத்தி உணவு தயாரிக்கும் செயல்.\n\nCO₂ + H₂O + சூரிய ஒளி → குளுக்கோஸ் + O₂\n\nஇதோடு தொடர்புடையது: கணவர், குளோரோஃபில், உணவு சங்கிலி 🦉"
  },
  {
    keywords: ["newton", "நியூட்டன்", "விசை", "இயக்க விதி"],
    answer: "நியூட்டனின் இயக்க விதிகள் — 'Newton's Laws of Motion':\n1. ஓய்வு நிலை விதி\n2. F=ma விதி\n3. செயல்-எதிர்செயல் விதி\n\nஇதோடு தொடர்புடையது: ஈர்ப்பு விசை, உராய்வு, வேகம் 🦉"
  },
  {
    keywords: ["தமிழ்", "இலக்கணம்", "எழுத்து", "சொல்"],
    answer: "தமிழ் இலக்கணம் — 'Tamil Grammar' — 5 பிரிவுகள்:\nஎழுத்து, சொல், பொருள், யாப்பு, அணி\n\nஎழுத்துகள்: உயிர் (12) + மெய் (18) + உயிர்மெய் (216)\n\nஇதோடு தொடர்புடையது: தொல்காப்பியம், நன்னூல் 🦉"
  },
  {
    keywords: ["algorithm", "prompt", "machine learning"],
    answer: "Algorithm — 'Algorithm' என்று ஆங்கிலத்தில் சொல்வார்கள் — கணினிக்கு கொடுக்கும் step-by-step வழிமுறை.\n\nஇதோடு தொடர்புடையது: Programming, AI, Data Structures 🦉"
  },
];

export function getOfflineAnswer(question) {
  const lower = question.toLowerCase();
  for (const item of OFFLINE_QA) {
    if (item.keywords.some(kw => lower.includes(kw))) return item.answer;
  }
  return "இப்போது internet இல்லை. Connection வந்தால் விரிவாக சொல்கிறேன். உன் கேள்வியை மீண்டும் கேட்கலாம்! 🦉";
}

// ── Ask Vidhu — stable function, no re-render issues ──────────────────────
export async function askVidhu(messages, apiKey, studentClass, markFilter) {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("No API key");
  }

  const systemPrompt = buildSystemPrompt(studentClass, markFilter);

  const contents = messages
    .filter(m => m.content && m.content.trim())
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.replace(/^\[.*?\] /, "") }]
    }));

  const maxTokens = !markFilter ? 400
    : markFilter.marks <= 2  ? 200
    : markFilter.marks <= 3  ? 350
    : markFilter.marks <= 5  ? 800
    : markFilter.marks <= 8  ? 1200
    : 2000;

  const response = await fetch(
    'https://kalvi-ai-dashboard.vercel.app/api/gemini',
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: markFilter ? 0.6 : 0.75,
          maxOutputTokens: maxTokens,
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

// ── Subject Detection ──────────────────────────────────────────────────────
const SUBJECT_KEYWORDS = {
  'Science':  ['photosynthesis','ஒளிச்சேர்க்கை','newton','நியூட்டன்','physics','chemistry','biology','வேதியியல்','இயற்பியல்','உயிரியல்','cell','atom','force','energy','acid','base','molecule','dna'],
  'Maths':    ['equation','கணக்கு','algebra','geometry','triangle','circle','fraction','decimal','percentage','area','volume','angle','theorem','number','கணிதம்'],
  'Tamil':    ['இலக்கணம்','கவிதை','சங்கம்','தொல்காப்பியம்','நன்னூல்','உயிர்','மெய்','திணை','குறள்','thirukkural','இலக்கியம்','தமிழ்'],
  'Social':   ['history','geography','civics','economics','வரலாறு','புவியியல்','அரசியல்','பொருளாதாரம்','river','mountain','empire','revolution','constitution'],
  'English':  ['grammar','tense','verb','noun','adjective','essay','comprehension','vocabulary','spelling'],
  'Computer': ['computer','கணினி','software','hardware','program','internet','network','storage'],
  'AI':       ['ai','artificial intelligence','machine learning','prompt','chatgpt','robot','automation','neural','dataset'],
};

export function detectSubject(question) {
  const lower = question.toLowerCase();
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return subject;
  }
  return 'Other';
}
