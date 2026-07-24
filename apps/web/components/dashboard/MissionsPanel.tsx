'use client'

const MISSIONS = [
  {
    id: 1, week: 1, title: 'AI என்ன செய்கிறது?', icon: '🤖', xp: 20,
    completed: 32, total: 42,
    students: ['பிரியா', 'அர்ஜுன்', 'கவிதா', 'முருகன்', 'சரண்யா'],
  },
  {
    id: 2, week: 2, title: 'வீட்டில் AI கண்டுபிடி', icon: '🔍', xp: 30,
    completed: 24, total: 42,
    students: ['பிரியா', 'அர்ஜுன்', 'கவிதா'],
  },
  {
    id: 3, week: 3, title: 'AI தவறாக சொல்லும்!', icon: '🧐', xp: 40,
    completed: 0, total: 42,
    students: [],
  },
  {
    id: 4, week: 4, title: 'குடும்பத்திற்கு சொல்லு', icon: '👨‍👩‍👧', xp: 50,
    completed: 0, total: 42,
    students: [],
  },
]

export default function MissionsPanel({ teacher }: { teacher: { className: string } }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>பணி நிலை — {teacher.className}</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>எந்த மாணவர் எந்த பணி முடித்தார் என்று பாருங்கள்</div>
      </div>

      <div style={{ background: '#1B3A6B', borderRadius: 16, padding: 20, marginBottom: 20, color: '#fff' }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Module 1 — ஒட்டுமொத்த முன்னேற்றம்</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 10 }}>
              <div style={{ width: '57%', background: '#E8A020', height: '100%', borderRadius: 8 }} />
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>57%</div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
          24 மாணவர்கள் குறைந்தது 1 பணி முடித்துள்ளார்கள்
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MISSIONS.map((m) => (
          <div key={m.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 32 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1612' }}>வாரம் {m.week}: {m.title}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020' }}>+{m.xp} XP</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, background: '#E2DDD7', borderRadius: 8, height: 6 }}>
                    <div style={{ width: `${(m.completed / m.total) * 100}%`, background: m.completed === 0 ? '#E2DDD7' : '#E8A020', height: '100%', borderRadius: 8 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6B6560' }}>{m.completed}/{m.total}</div>
                </div>
              </div>
            </div>
            {m.completed > 0 && (
              <div style={{ padding: '0 20px 14px', borderTop: '1px solid #F7F3ED' }}>
                <div style={{ fontSize: 11, color: '#6B6560', marginBottom: 8, marginTop: 8 }}>முடித்த மாணவர்கள்:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {m.students.map(name => (
                    <span key={name} style={{ background: '#E1F0E9', color: '#2D7A5F', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{name}</span>
                  ))}
                </div>
              </div>
            )}
            {m.completed === 0 && (
              <div style={{ padding: '10px 20px 14px', background: '#F7F3ED' }}>
                <div style={{ fontSize: 12, color: '#6B6560' }}>வாரம் {m.week} session நடத்தினால் தொடங்குவார்கள்</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: '#FDF3E0', border: '1px solid #E8A020', borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#E8A020', marginBottom: 6 }}>🥉 Bronze Certificate — தயார் நிலை</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 12 }}>8 மாணவர்கள் Bronze certificate பெற தயாராக உள்ளார்கள்.</div>
        <button style={{ background: '#E8A020', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          🖨️ Certificates Print செய்
        </button>
      </div>
    </div>
  )
}
