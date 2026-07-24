'use client'

const STATS = [
  { icon: '👦', label: 'மொத்த மாணவர்கள்', labelEn: 'Total Students',  value: 42,  color: '#1B3A6B', bg: '#E6EEF8' },
  { icon: '💬', label: 'மொத்த கேள்விகள்',  labelEn: 'Total Questions', value: 458, color: '#2D7A5F', bg: '#E1F0E9' },
  { icon: '📅', label: 'இன்று active',      labelEn: 'Active Today',    value: 28,  color: '#E8A020', bg: '#FDF3E0' },
  { icon: '⚠️', label: 'கவனம் தேவை',      labelEn: 'Need Attention',  value: 3,   color: '#C45C3A', bg: '#FAEAE4' },
]

const TOP_STUDENTS = [
  { name: 'பிரியா',   questions: 34, topSubject: 'Science' },
  { name: 'அர்ஜுன்', questions: 28, topSubject: 'Maths'   },
  { name: 'கவிதா',   questions: 22, topSubject: 'Tamil'   },
  { name: 'முருகன்', questions: 18, topSubject: 'Science' },
  { name: 'சரண்யா', questions: 12, topSubject: 'Social'  },
]

interface Props {
  teacher: { name: string; school: string; className: string; district: string }
}

export default function OverviewPanel({ teacher }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>வணக்கம், {teacher.name} ஆசிரியர்! 👋</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>{teacher.className} வகுப்பு • {teacher.district}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E2DDD7' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1612', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#6B6560' }}>{s.labelEn}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>💬 அதிக கேள்விகள் கேட்டவர்கள்</div>
        {TOP_STUDENTS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < TOP_STUDENTS.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
            <div style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1) + '.'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: '#6B6560' }}>அதிகம்: {s.topSubject}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>{s.questions}</div>
              <div style={{ fontSize: 11, color: '#6B6560' }}>கேள்விகள்</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#FAEAE4', border: '1px solid #C45C3A', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#C45C3A', marginBottom: 6 }}>⚠️ கவனம் தேவைப்படும் மாணவர்கள்</div>
        <div style={{ fontSize: 13, color: '#6B6560' }}>தேவி, கார்த்திக், சரண்யா — விதுவிடம் கேள்விகள் கேட்கவில்லை.</div>
      </div>
    </div>
  )
}
