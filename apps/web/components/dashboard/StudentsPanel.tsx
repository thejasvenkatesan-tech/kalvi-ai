'use client'

import { useState } from 'react'

const STUDENTS = [
  { id: 1,  name: 'பிரியா',      roll: '001', xp: 120, streak: 5, missions: 3, badges: 2, lastActive: 'இன்று',      status: 'active' },
  { id: 2,  name: 'அர்ஜுன்',    roll: '002', xp: 110, streak: 4, missions: 3, badges: 2, lastActive: 'இன்று',      status: 'active' },
  { id: 3,  name: 'கவிதா',      roll: '003', xp: 90,  streak: 3, missions: 2, badges: 1, lastActive: 'நேற்று',     status: 'active' },
  { id: 4,  name: 'முருகன்',    roll: '004', xp: 80,  streak: 2, missions: 2, badges: 1, lastActive: 'நேற்று',     status: 'active' },
  { id: 5,  name: 'சரண்யா',    roll: '005', xp: 70,  streak: 1, missions: 1, badges: 1, lastActive: '2 நாள் முன்', status: 'inactive' },
  { id: 6,  name: 'விக்ரம்',    roll: '006', xp: 60,  streak: 0, missions: 1, badges: 0, lastActive: '3 நாள் முன்', status: 'inactive' },
  { id: 7,  name: 'தேவி',       roll: '007', xp: 50,  streak: 0, missions: 1, badges: 0, lastActive: '5 நாள் முன்', status: 'atrisk'  },
  { id: 8,  name: 'கார்த்திக்', roll: '008', xp: 20,  streak: 0, missions: 0, badges: 0, lastActive: 'உள்நுழையவில்லை', status: 'atrisk' },
]

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: '#E1F0E9', color: '#2D7A5F', label: 'Active' },
  inactive: { bg: '#FDF3E0', color: '#E8A020', label: 'Inactive' },
  atrisk:   { bg: '#FAEAE4', color: '#C45C3A', label: 'கவனம் தேவை' },
}

interface Props {
  teacher: { className: string; schoolCode: string }
}

export default function StudentsPanel({ teacher }: Props) {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.includes(search) || s.roll.includes(search)
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>மாணவர்கள் — {teacher.className}</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>School Code: <strong>{teacher.schoolCode}</strong> — மாணவர்கள் இந்த code பயன்படுத்தி join செய்கிறார்கள்</div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'மொத்தம்',       value: STUDENTS.length,                              color: '#1B3A6B', bg: '#E6EEF8' },
          { label: 'Active இன்று',   value: STUDENTS.filter(s=>s.status==='active').length, color: '#2D7A5F', bg: '#E1F0E9' },
          { label: 'கவனம் தேவை',   value: STUDENTS.filter(s=>s.status==='atrisk').length, color: '#C45C3A', bg: '#FAEAE4' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#6B6560', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="மாணவர் பெயர் அல்லது roll number..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 14, outline: 'none' }}
        />
        {['all', 'active', 'inactive', 'atrisk'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '10px 16px', borderRadius: 8, border: '1px solid #E2DDD7', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: filter === f ? '#1B3A6B' : '#fff',
              color: filter === f ? '#fff' : '#6B6560',
            }}>
            {f === 'all' ? 'அனைவரும்' : f === 'active' ? 'Active' : f === 'inactive' ? 'Inactive' : 'கவனம்'}
          </button>
        ))}
      </div>

      {/* Students table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F3ED', borderBottom: '1px solid #E2DDD7' }}>
              {['Roll', 'பெயர்', 'XP', 'Streak', 'பணிகள்', 'பட்ஜ்கள்', 'கடைசியாக', 'நிலை'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B6560', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #E2DDD7' : 'none', background: s.status === 'atrisk' ? '#FFFAF9' : '#fff' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B6560' }}>{s.roll}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{s.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#E8A020' }}>{s.xp}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: s.streak > 0 ? '#C45C3A' : '#6B6560' }}>{s.streak > 0 ? `🔥 ${s.streak}` : '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#1A1612' }}>{s.missions}/4</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#1A1612' }}>{s.badges}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6560' }}>{s.lastActive}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: STATUS_COLORS[s.status].bg, color: STATUS_COLORS[s.status].color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {STATUS_COLORS[s.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* At-risk alert */}
      {STUDENTS.filter(s => s.status === 'atrisk').length > 0 && (
        <div style={{ background: '#FAEAE4', border: '1px solid #C45C3A', borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#C45C3A', marginBottom: 8 }}>⚠️ கவனம் தேவைப்படும் மாணவர்கள்</div>
          <div style={{ fontSize: 13, color: '#6B6560' }}>
            {STUDENTS.filter(s => s.status === 'atrisk').map(s => s.name).join(', ')} — 5 நாட்களுக்கும் மேலாக login செய்யவில்லை. அவர்களிடம் பேசுங்கள்.
          </div>
        </div>
      )}
    </div>
  )
}
