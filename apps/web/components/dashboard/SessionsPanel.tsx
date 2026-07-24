'use client'

import { useState } from 'react'

const SESSIONS = [
  { week: 1, topic: 'AI என்றால் என்ன?',        date: '2026-07-07', attendance: 38, total: 42, done: true,  notes: 'மாணவர்கள் மிகவும் ஆர்வமாக கேட்டார்கள்' },
  { week: 2, topic: 'Prompt எழுதுவது எப்படி?', date: '2026-07-14', attendance: 35, total: 42, done: true,  notes: 'ChatGPT demo பிடித்திருந்தது' },
  { week: 3, topic: 'AI தவறாக சொல்லும்!',      date: '2026-07-21', attendance: null, total: 42, done: false, notes: '' },
  { week: 4, topic: 'குடும்பத்திற்கு சொல்லு',  date: '2026-07-28', attendance: null, total: 42, done: false, notes: '' },
]

const SESSION_KITS = [
  { week: 1, title: 'AI என்றால் என்ன? — Session Kit',        size: '2.1 MB' },
  { week: 2, title: 'Prompt எழுதுவது — Session Kit',          size: '1.8 MB' },
  { week: 3, title: 'AI Fact Check — Session Kit',            size: '2.4 MB' },
  { week: 4, title: 'குடும்பத்திற்கு சொல்லு — Session Kit',  size: '1.6 MB' },
]

export default function SessionsPanel({ teacher }: { teacher: { className: string } }) {
  const [notes, setNotes]           = useState('')
  const [attendance, setAttendance] = useState('')
  const [saved, setSaved]           = useState(false)

  function markDone() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>வகுப்பு நிர்வாகம்</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>Session கள் நடத்து, kit பதிவிறக்கு, attendance பதிவிடு</div>
      </div>

      {/* This week highlight */}
      <div style={{ background: '#1B3A6B', borderRadius: 16, padding: 20, marginBottom: 20, color: '#fff' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>இந்த வாரம் நடத்த வேண்டியது</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>வாரம் 3: AI தவறாக சொல்லும்!</div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E8A020', marginBottom: 8 }}>📋 Session திட்டம்:</div>
          {[
            '0–5 நிமிடம்: கடந்த வாரம் recap — Prompt என்றால் என்ன?',
            '5–15 நிமிடம்: விது கட்டப்பட்ட கேள்வி கேட்கும் — மாணவர்கள் பதிலை சரிபார்க்கும்',
            '15–25 நிமிடம்: Groups — AI தவறான தகவல் கண்டுபிடி activity',
            '25–30 நிமிடம்: முடிவு — Fact Check என்றால் என்ன?',
          ].map((step, i) => (
            <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4, paddingLeft: 8, borderLeft: '2px solid rgba(232,160,32,0.4)' }}>
              {step}
            </div>
          ))}
        </div>

        {/* Mark attendance */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input
            type='number'
            value={attendance}
            onChange={e => setAttendance(e.target.value)}
            placeholder='Attendance எண்ணிக்கை...'
            style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 14 }}
          />
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder='குறிப்புகள் (optional)...'
            style={{ flex: 2, padding: '9px 12px', borderRadius: 8, border: 'none', fontSize: 14 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={markDone}
            style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            {saved ? '✅ சேமிக்கப்பட்டது!' : '✅ வகுப்பு நடந்தது — சேமி'}
          </button>
          <button
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            📄 Session Kit
          </button>
        </div>
      </div>

      {/* All sessions */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>
          Module 1 — அனைத்து வகுப்புகள்
        </div>
        {SESSIONS.map((s, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < SESSIONS.length - 1 ? '1px solid #E2DDD7' : 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.done ? '#E1F0E9' : '#E6EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {s.done ? '✅' : '📅'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>வாரம் {s.week}: {s.topic}</div>
              <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>
                {s.done ? `${s.date} • ${s.attendance}/${s.total} மாணவர்கள்` : s.date + ' — திட்டமிடப்பட்டுள்ளது'}
              </div>
              {s.notes && <div style={{ fontSize: 12, color: '#2D7A5F', marginTop: 4, fontStyle: 'italic' }}>"{s.notes}"</div>}
            </div>
            {s.done && (
              <div style={{ background: '#E1F0E9', color: '#2D7A5F', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {Math.round((s.attendance! / s.total) * 100)}% attendance
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session kit downloads */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>
          📄 Session Kits — தமிழ் PDF
        </div>
        {SESSION_KITS.map((kit, i) => (
          <div key={i} style={{ padding: '12px 20px', borderBottom: i < SESSION_KITS.length - 1 ? '1px solid #E2DDD7' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>📄</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>வாரம் {kit.week}: {kit.title}</div>
              <div style={{ fontSize: 11, color: '#6B6560' }}>{kit.size} • தமிழ் PDF</div>
            </div>
            <a href='#' style={{ background: '#1B3A6B', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              பதிவிறக்கு
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
