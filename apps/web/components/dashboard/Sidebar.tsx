'use client'

import { ActivePanel } from '@/app/dashboard/page'

const NAV = [
  { id: 'overview',  icon: '🏠', label: 'முகப்பு',      labelEn: 'Overview'  },
  { id: 'students',  icon: '👦', label: 'மாணவர்கள்',   labelEn: 'Students'  },
  { id: 'sessions',  icon: '📅', label: 'வகுப்புகள்',   labelEn: 'Sessions'  },
  { id: 'missions',  icon: '🎯', label: 'பணிகள்',       labelEn: 'Missions'  },
]

interface Props {
  teacher: { name: string; school: string; className: string; schoolCode: string }
  activePanel: ActivePanel
  setActivePanel: (p: ActivePanel) => void
}

export default function Sidebar({ teacher, activePanel, setActivePanel }: Props) {
  return (
    <aside style={{
      width: 240, background: '#1B3A6B', display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>கல்வி.AI 🦉</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Teacher Dashboard</div>
      </div>

      {/* Teacher info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8A020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>
          👨‍🏫
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{teacher.name} ஆசிரியர்</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{teacher.className} வகுப்பு</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{teacher.school}</div>
        <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', display: 'inline-block' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>School Code: </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#E8A020' }}>{teacher.schoolCode}</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePanel(item.id as ActivePanel)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: activePanel === item.id ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: activePanel === item.id ? '3px solid #E8A020' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{item.labelEn}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          Powered by Daruma™
        </div>
      </div>
    </aside>
  )
}
