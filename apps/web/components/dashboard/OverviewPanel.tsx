'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const SCHOOL_CODE = 'KA8042'

export default function OverviewPanel({ teacher }: { teacher: { name: string; school: string; className: string; district: string; schoolId?: string } }) {
  const [stats, setStats]       = useState({ total: 0, questions: 0, activeToday: 0, atRisk: 0 })
  const [topStudents, setTopStudents] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [atRiskList, setAtRiskList] = useState<string[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    if (!teacher.schoolId) { setLoading(false); return }

    // Get all students
    const { data: students } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', teacher.schoolId)

    if (students) {
      const now = Date.now()
      const activeToday = students.filter(s => {
        if (!s.last_active) return false
        return new Date(s.last_active).toDateString() === new Date().toDateString()
      }).length

      const atRisk = students.filter(s => {
        if (!s.last_active) return true
        return (now - new Date(s.last_active).getTime()) / 86400000 > 5
      })

      setAtRiskList(atRisk.map(s => s.name))

      const totalQuestions = students.reduce((a, s) => a + (s.questions_asked || 0), 0)

      setStats({
        total: students.length,
        questions: totalQuestions,
        activeToday,
        atRisk: atRisk.length,
      })

      // Top 5 by questions
      const sorted = [...students].sort((a, b) => (b.questions_asked || 0) - (a.questions_asked || 0)).slice(0, 5)
      setTopStudents(sorted)
    }

    // Recent topic searches
    const { data: searches } = await supabase
      .from('topic_searches')
      .select('*, students(name)')
      .eq('school_id', teacher.schoolId)
      .order('searched_at', { ascending: false })
      .limit(5)

    if (searches) setRecentSearches(searches)

    setLoading(false)
  }

  const STATS = [
    { icon: '👦', label: 'மொத்த மாணவர்கள்', labelEn: 'Total Students',  value: stats.total,      color: '#1B3A6B', bg: '#E6EEF8' },
    { icon: '💬', label: 'மொத்த கேள்விகள்',  labelEn: 'Total Questions', value: stats.questions,  color: '#2D7A5F', bg: '#E1F0E9' },
    { icon: '📅', label: 'இன்று active',      labelEn: 'Active Today',    value: stats.activeToday, color: '#E8A020', bg: '#FDF3E0' },
    { icon: '⚠️', label: 'கவனம் தேவை',      labelEn: 'Need Attention',  value: stats.atRisk,     color: '#C45C3A', bg: '#FAEAE4' },
  ]

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6B6560' }}>ஏற்றுகிறோம்...</div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Recent activity */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>🕐 சமீபத்திய கேள்விகள்</div>
          {recentSearches.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6B6560', fontSize: 13, padding: 20 }}>
              இன்னும் கேள்விகள் இல்லை
            </div>
          ) : recentSearches.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < recentSearches.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1B3A6B', flexShrink: 0 }}>
                {s.students?.name?.[0] || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{s.students?.name || 'Unknown'}</div>
                <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>{s.question?.slice(0, 50)}{s.question?.length > 50 ? '...' : ''}</div>
              </div>
              <div style={{ fontSize: 11, color: '#6B6560', whiteSpace: 'nowrap' }}>
                {new Date(s.searched_at).toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        {/* Top students */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>💬 அதிக கேள்விகள் கேட்டவர்கள்</div>
          {topStudents.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6B6560', fontSize: 13, padding: 20 }}>மாணவர்கள் இல்லை</div>
          ) : topStudents.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < topStudents.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
              <div style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#6B6560' }}>{s.class}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>{s.questions_asked || 0}</div>
                <div style={{ fontSize: 11, color: '#6B6560' }}>கேள்விகள்</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {atRiskList.length > 0 && (
        <div style={{ background: '#FAEAE4', border: '1px solid #C45C3A', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#C45C3A', marginBottom: 6 }}>⚠️ கவனம் தேவைப்படும் மாணவர்கள்</div>
          <div style={{ fontSize: 13, color: '#6B6560' }}>
            {atRiskList.join(', ')} — விதுவிடம் கேள்விகள் கேட்கவில்லை.
          </div>
        </div>
      )}
    </div>
  )
}
