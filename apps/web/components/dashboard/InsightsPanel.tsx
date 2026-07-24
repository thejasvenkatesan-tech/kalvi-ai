'use client'

import { useState } from 'react'

const TOPIC_DATA = {
  bySubject: [
    { subject: 'Science',  count: 142, color: '#2D7A5F', bg: '#E1F0E9', icon: '🔬' },
    { subject: 'Maths',    count: 98,  color: '#1B3A6B', bg: '#E6EEF8', icon: '📐' },
    { subject: 'Tamil',    count: 76,  color: '#E8A020', bg: '#FDF3E0', icon: '📖' },
    { subject: 'Social',   count: 54,  color: '#C45C3A', bg: '#FAEAE4', icon: '🌍' },
    { subject: 'English',  count: 38,  color: '#1B3A6B', bg: '#E6EEF8', icon: '🔤' },
    { subject: 'AI',       count: 32,  color: '#2D7A5F', bg: '#E1F0E9', icon: '🤖' },
    { subject: 'Computer', count: 18,  color: '#6B6560', bg: '#F7F3ED', icon: '💻' },
  ],
  topTopics: [
    { topic: 'Photosynthesis',      subject: 'Science', count: 28, needsAttention: true  },
    { topic: "Newton's Laws",       subject: 'Science', count: 22, needsAttention: true  },
    { topic: 'Fractions',           subject: 'Maths',   count: 19, needsAttention: true  },
    { topic: 'Tamil Grammar',       subject: 'Tamil',   count: 16, needsAttention: false },
    { topic: 'Cell Structure',      subject: 'Science', count: 14, needsAttention: true  },
    { topic: 'Indian Independence', subject: 'Social',  count: 12, needsAttention: false },
    { topic: 'Algebra',             subject: 'Maths',   count: 11, needsAttention: false },
    { topic: 'Acids & Bases',       subject: 'Science', count: 10, needsAttention: true  },
    { topic: 'Thirukkural',         subject: 'Tamil',   count: 9,  needsAttention: false },
    { topic: 'AI basics',           subject: 'AI',      count: 8,  needsAttention: false },
  ],
  byStudent: [
    { name: 'பிரியா',      questions: 34, topSubject: 'Science' },
    { name: 'அர்ஜுன்',    questions: 28, topSubject: 'Maths'   },
    { name: 'கவிதா',      questions: 22, topSubject: 'Tamil'   },
    { name: 'முருகன்',    questions: 18, topSubject: 'Science' },
    { name: 'சரண்யா',    questions: 12, topSubject: 'Social'  },
    { name: 'விக்ரம்',    questions: 8,  topSubject: 'English' },
    { name: 'தேவி',       questions: 6,  topSubject: 'Maths'   },
    { name: 'கார்த்திக்', questions: 2,  topSubject: 'Science' },
  ],
  weekly: [
    { day: 'திங்கள்',  count: 45 },
    { day: 'செவ்வாய்', count: 62 },
    { day: 'புதன்',    count: 38 },
    { day: 'வியாழன்',  count: 71 },
    { day: 'வெள்ளி',   count: 56 },
    { day: 'சனி',      count: 18 },
    { day: 'ஞாயிறு',  count: 12 },
  ]
}

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  Science:  { color: '#2D7A5F', bg: '#E1F0E9' },
  Maths:    { color: '#1B3A6B', bg: '#E6EEF8' },
  Tamil:    { color: '#E8A020', bg: '#FDF3E0' },
  Social:   { color: '#C45C3A', bg: '#FAEAE4' },
  English:  { color: '#1B3A6B', bg: '#E6EEF8' },
  AI:       { color: '#2D7A5F', bg: '#E1F0E9' },
  Computer: { color: '#6B6560', bg: '#F7F3ED' },
}

export default function InsightsPanel({ teacher }: { teacher: { className: string } }) {
  const [activeTab, setActiveTab] = useState('subjects')
  const total = TOPIC_DATA.bySubject.reduce((a, s) => a + s.count, 0)
  const maxWeekly = Math.max(...TOPIC_DATA.weekly.map(d => d.count))
  const needsAttention = TOPIC_DATA.topTopics.filter(t => t.needsAttention)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>கற்றல் நுண்ணறிவு</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>மாணவர்கள் விதுவிடம் கேட்ட கேள்விகள் — {teacher.className} வகுப்பு</div>
      </div>

      {needsAttention.length > 0 && (
        <div style={{ background: '#FDF3E0', border: '1px solid #E8A020', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#E8A020', marginBottom: 8 }}>📢 வகுப்பில் கூடுதல் விளக்கம் தேவை</div>
          <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 10 }}>இந்த தலைப்புகளில் மாணவர்கள் அதிகமாக கேள்விகள் கேட்கிறார்கள்:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {needsAttention.map(t => (
              <div key={t.topic} style={{ background: '#fff', border: '1px solid #E8A020', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                {t.topic} <span style={{ color: '#E8A020' }}>({t.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'மொத்த கேள்விகள்',       value: total, icon: '💬', color: '#1B3A6B', bg: '#E6EEF8' },
          { label: 'இந்த வாரம்',              value: 302,   icon: '📅', color: '#2D7A5F', bg: '#E1F0E9' },
          { label: 'செயலில் உள்ள மாணவர்',   value: 7,     icon: '👦', color: '#E8A020', bg: '#FDF3E0' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6B6560', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { id: 'subjects', label: '📊 பாட வரைபடம்'    },
          { id: 'topics',   label: '🔥 Top தலைப்புகள்'  },
          { id: 'students', label: '👦 மாணவர் நிலை'     },
          { id: 'activity', label: '📈 வார செயல்பாடு'   },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2DDD7', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: activeTab === tab.id ? '#1B3A6B' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#6B6560' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'subjects' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>எந்த பாடத்தில் அதிக கேள்விகள்?</div>
          {TOPIC_DATA.bySubject.map(s => (
            <div key={s.subject} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.subject}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: 11, color: '#6B6560' }}>{Math.round((s.count / total) * 100)}%</span>
                </div>
              </div>
              <div style={{ background: '#F7F3ED', borderRadius: 8, height: 10 }}>
                <div style={{ width: `${(s.count / TOPIC_DATA.bySubject[0].count) * 100}%`, background: s.color, height: '100%', borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'topics' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>Top 10 தலைப்புகள்</div>
          {TOPIC_DATA.topTopics.map((t, i) => {
            const sc = SUBJECT_COLORS[t.subject] || SUBJECT_COLORS.Computer
            return (
              <div key={t.topic} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < TOPIC_DATA.topTopics.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#6B6560', minWidth: 24 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t.topic}</span>
                    {t.needsAttention && <span style={{ fontSize: 10, background: '#FDF3E0', color: '#E8A020', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>கவனம்</span>}
                  </div>
                  <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '1px 8px', borderRadius: 10, fontWeight: 600 }}>{t.subject}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{t.count}</div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'students' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>மாணவர் கேள்வி நிலை</div>
          {TOPIC_DATA.byStudent.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < TOPIC_DATA.byStudent.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
              <div style={{ fontSize: 16, width: 28, textAlign: 'center' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#6B6560' }}>அதிகம்: {s.topSubject}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>{s.questions}</div>
                <div style={{ fontSize: 11, color: '#6B6560' }}>கேள்விகள்</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 20 }}>வார செயல்பாடு</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
            {TOPIC_DATA.weekly.map(d => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B' }}>{d.count}</div>
                <div style={{ width: '100%', height: `${(d.count / maxWeekly) * 120}px`, background: d.count === maxWeekly ? '#E8A020' : '#1B3A6B', borderRadius: '6px 6px 0 0', opacity: d.count === maxWeekly ? 1 : 0.6 }} />
                <div style={{ fontSize: 10, color: '#6B6560', textAlign: 'center' }}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
