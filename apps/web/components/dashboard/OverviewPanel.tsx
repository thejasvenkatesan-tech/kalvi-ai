'use client'

import { useState } from 'react'

const STATS = [
  { icon: '👦', label: 'மொத்த மாணவர்கள்', labelEn: 'Total Students', value: 42, color: '#1B3A6B', bg: '#E6EEF8' },
  { icon: '✅', label: 'இன்று active',      labelEn: 'Active Today',   value: 28, color: '#2D7A5F', bg: '#E1F0E9' },
  { icon: '🎯', label: 'பணி முடிந்தவர்',   labelEn: 'Missions Done',  value: 18, color: '#E8A020', bg: '#FDF3E0' },
  { icon: '🏅', label: 'பட்ஜ்கள்',         labelEn: 'Badges Earned',  value: 34, color: '#C45C3A', bg: '#FAEAE4' },
]

const WEEKLY_SESSIONS = [
  { week: 'வாரம் 1', done: true,  topic: 'AI என்றால் என்ன?',        students: 38 },
  { week: 'வாரம் 2', done: true,  topic: 'Prompt எழுதுவது எப்படி?',  students: 35 },
  { week: 'வாரம் 3', done: false, topic: 'AI தவறாக சொல்லும்!',       students: null },
  { week: 'வாரம் 4', done: false, topic: 'குடும்பத்திற்கு சொல்லு',   students: null },
]

const TOP_STUDENTS = [
  { name: 'பிரியா',   xp: 120, badge: '🥉', missions: 3 },
  { name: 'அர்ஜுன்', xp: 110, badge: '🥉', missions: 3 },
  { name: 'கவிதா',   xp: 90,  badge: '💬', missions: 2 },
  { name: 'முருகன்', xp: 80,  badge: '💬', missions: 2 },
  { name: 'சரண்யா', xp: 70,  badge: '💬', missions: 1 },
]

interface Props {
  teacher: { name: string; school: string; className: string; district: string }
}

export default function OverviewPanel({ teacher }: Props) {
  const [markingSession, setMarkingSession] = useState(false)
  const [attendance, setAttendance] = useState('')
  const [saved, setSaved] = useState(false)

  function saveSession() {
    setSaved(true)
    setMarkingSession(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>
          வணக்கம், {teacher.name} ஆசிரியர்! 👋
        </div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>
          {teacher.className} வகுப்பு • {teacher.district}
        </div>
      </div>

      {/* This week session card */}
      <div style={{ background: '#1B3A6B', borderRadius: 16, padding: 20, marginBottom: 20, color: '#fff' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          இந்த வாரம் — வாரம் 3
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>AI தவறாக சொல்லும்!</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          மாணவர்கள் AI பதில்களை fact-check செய்யக் கற்றுக்கொள்வார்கள்
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setMarkingSession(!markingSession)}
            style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            📄 Session Kit பதிவிறக்கு
          </button>
          <button
            onClick={() => setMarkingSession(true)}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
            {saved ? '✅ சேமிக்கப்பட்டது!' : '✅ வகுப்பு நடந்தது'}
          </button>
        </div>
        {markingSession && (
          <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>இன்று எத்தனை மாணவர்கள் வந்தார்கள்?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={attendance}
                onChange={e => setAttendance(e.target.value)}
                placeholder="எண்ணிக்கை..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none', fontSize: 14 }}
              />
              <button
                onClick={saveSession}
                style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>
                சேமி
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E2DDD7' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1612', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#6B6560' }}>{s.labelEn}</div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Session progress */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>Module 1 — வகுப்பு நிலை</div>
          {WEEKLY_SESSIONS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < WEEKLY_SESSIONS.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? '#E1F0E9' : '#E6EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                {s.done ? '✅' : '📅'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.done ? '#2D7A5F' : '#1A1612' }}>{s.topic}</div>
                <div style={{ fontSize: 11, color: '#6B6560', marginTop: 2 }}>
                  {s.done ? `${s.students} மாணவர்கள்` : s.week + ' — வரவிருக்கிறது'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top students */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>🏆 Top மாணவர்கள்</div>
          {TOP_STUDENTS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < TOP_STUDENTS.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
              <div style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#6B6560' }}>{s.missions} பணிகள் • {s.badge}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#E8A020' }}>{s.xp} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* School leaderboard */}
      <div style={{ background: '#E6EEF8', borderRadius: 12, padding: 16, marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 32 }}>🏫</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{teacher.school}</div>
          <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>
            {teacher.district} மாவட்ட தரவரிசை: <strong style={{ color: '#1B3A6B' }}>#4</strong> — இந்த வாரம் #3-க்கு போகலாம்!
          </div>
        </div>
        <div style={{ background: '#1B3A6B', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
          320 pts
        </div>
      </div>
    </div>
  )
}
