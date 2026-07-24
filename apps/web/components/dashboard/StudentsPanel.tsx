'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  Science: { color: '#2D7A5F', bg: '#E1F0E9' },
  Maths:   { color: '#1B3A6B', bg: '#E6EEF8' },
  Tamil:   { color: '#E8A020', bg: '#FDF3E0' },
  Social:  { color: '#C45C3A', bg: '#FAEAE4' },
  English: { color: '#1B3A6B', bg: '#E6EEF8' },
  AI:      { color: '#2D7A5F', bg: '#E1F0E9' },
  '—':     { color: '#6B6560', bg: '#F7F3ED' },
}

const STATUS: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: '#E1F0E9', color: '#2D7A5F', label: 'Active'      },
  inactive: { bg: '#FDF3E0', color: '#E8A020', label: 'Inactive'    },
  atrisk:   { bg: '#FAEAE4', color: '#C45C3A', label: 'கவனம் தேவை' },
}

export default function StudentsPanel({ teacher }: { teacher: { className: string; schoolCode: string; schoolId?: string } }) {
  const [students, setStudents]   = useState<any[]>([])
  const [topSubjects, setTopSubjects] = useState<Record<string, string>>({})
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    if (!teacher.schoolId) { setLoading(false); return }

    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', teacher.schoolId)
      .order('roll_number')

    if (data) setStudents(data)

    // Get top subject per student from topic_searches
    const { data: searches } = await supabase
      .from('topic_searches')
      .select('student_id, subject')
      .eq('school_id', teacher.schoolId)

    if (searches) {
      const subjectMap: Record<string, Record<string, number>> = {}
      searches.forEach(s => {
        if (!subjectMap[s.student_id]) subjectMap[s.student_id] = {}
        subjectMap[s.student_id][s.subject] = (subjectMap[s.student_id][s.subject] || 0) + 1
      })
      const topMap: Record<string, string> = {}
      Object.entries(subjectMap).forEach(([studentId, subjects]) => {
        topMap[studentId] = Object.entries(subjects).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
      })
      setTopSubjects(topMap)
    }

    setLoading(false)
  }

  function getStatus(s: any) {
    if (!s.last_active) return 'atrisk'
    const days = (Date.now() - new Date(s.last_active).getTime()) / 86400000
    if (days > 5) return 'atrisk'
    if (days > 2) return 'inactive'
    return 'active'
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name?.includes(search) || s.roll_number?.includes(search)
    const matchFilter = filter === 'all' || getStatus(s) === filter
    return matchSearch && matchFilter
  })

  const activeCount  = students.filter(s => getStatus(s) === 'active').length
  const atRiskCount  = students.filter(s => getStatus(s) === 'atrisk').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>மாணவர்கள்</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>School Code: <strong>{teacher.schoolCode}</strong></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'மொத்தம்',     value: students.length, color: '#1B3A6B', bg: '#E6EEF8' },
          { label: 'Active இன்று', value: activeCount,     color: '#2D7A5F', bg: '#E1F0E9' },
          { label: 'கவனம் தேவை', value: atRiskCount,     color: '#C45C3A', bg: '#FAEAE4' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#6B6560', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="மாணவர் பெயர் அல்லது roll number..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 14, outline: 'none' }} />
        {['all', 'active', 'inactive', 'atrisk'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #E2DDD7', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: filter === f ? '#1B3A6B' : '#fff', color: filter === f ? '#fff' : '#6B6560' }}>
            {f === 'all' ? 'அனைவரும்' : f === 'active' ? 'Active' : f === 'inactive' ? 'Inactive' : 'கவனம்'}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden', marginBottom: 16 }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6B6560' }}>ஏற்றுகிறோம்...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6B6560' }}>
            {students.length === 0 ? 'இன்னும் மாணவர்கள் பதிவு செய்யவில்லை — பதிவு செய் tab-ல் சேர்க்கவும்' : 'தேடல் பொருந்தவில்லை'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F3ED', borderBottom: '1px solid #E2DDD7' }}>
                {['Roll', 'பெயர்', 'வகுப்பு', 'கேள்விகள்', 'அதிக பாடம்', 'கடைசியாக', 'நிலை'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B6560', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const status = getStatus(s)
                const topSubject = topSubjects[s.id] || '—'
                const sc = SUBJECT_COLORS[topSubject] || SUBJECT_COLORS['—']
                const lastActive = s.last_active ? new Date(s.last_active).toLocaleDateString('ta-IN') : 'உள்நுழையவில்லை'
                return (
                  <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B6560' }}>{s.roll_number}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{s.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B6560' }}>{s.class}</td>
                    <td style={{ padding: '12px 16px', fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>{s.questions_asked || 0}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{topSubject}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6560' }}>{lastActive}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: STATUS[status].bg, color: STATUS[status].color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {STATUS[status].label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {atRiskCount > 0 && students.length > 0 && (
        <div style={{ background: '#FAEAE4', border: '1px solid #C45C3A', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#C45C3A', marginBottom: 6 }}>⚠️ கவனம் தேவைப்படும் மாணவர்கள்</div>
          <div style={{ fontSize: 13, color: '#6B6560' }}>
            {students.filter(s => getStatus(s) === 'atrisk').map(s => s.name).join(', ')} — விதுவிடம் கேள்விகள் கேட்கவில்லை.
          </div>
        </div>
      )}
    </div>
  )
}
