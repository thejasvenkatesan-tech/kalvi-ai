'use client'

import { useState, useEffect } from 'react'
import { getTopicSearches, getSavedReplies, supabase } from '@/lib/supabase'

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  Science:  { color: '#2D7A5F', bg: '#E1F0E9' },
  Maths:    { color: '#1B3A6B', bg: '#E6EEF8' },
  Tamil:    { color: '#E8A020', bg: '#FDF3E0' },
  Social:   { color: '#C45C3A', bg: '#FAEAE4' },
  English:  { color: '#1B3A6B', bg: '#E6EEF8' },
  AI:       { color: '#2D7A5F', bg: '#E1F0E9' },
  Computer: { color: '#6B6560', bg: '#F7F3ED' },
  Other:    { color: '#6B6560', bg: '#F7F3ED' },
}

export default function InsightsPanel({ teacher }: { teacher: { className: string; schoolId?: string; schoolCode: string } }) {
  const [activeTab, setActiveTab]             = useState('overview')
  const [searches, setSearches]               = useState<any[]>([])
  const [students, setStudents]               = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentReplies, setStudentReplies]   = useState<any[]>([])
  const [loading, setLoading]                 = useState(true)
  const [subjectFilter, setSubjectFilter]     = useState('All')
  const [expandedSearch, setExpandedSearch]   = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    if (!teacher.schoolId) { setLoading(false); return }

    const { data: searchData } = await getTopicSearches(teacher.schoolId)
    if (searchData) setSearches(searchData)

    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', teacher.schoolId)
      .order('questions_asked', { ascending: false })
    if (studentData) setStudents(studentData)

    setLoading(false)
  }

  async function loadStudentDetail(student: any) {
    setSelectedStudent(student)
    setActiveTab('student-detail')
    const { data } = await getSavedReplies(student.id)
    setStudentReplies(data || [])
  }

  const subjectCounts: Record<string, number> = {}
  searches.forEach(s => { subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1 })
  const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])
  const maxSubjectCount = sortedSubjects[0]?.[1] || 1

  const topicCounts: Record<string, { count: number; subject: string }> = {}
  searches.forEach(s => {
    const key = s.question?.slice(0, 60) || 'Unknown'
    topicCounts[key] = { count: (topicCounts[key]?.count || 0) + 1, subject: s.subject }
  })
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 15)

  const filteredSearches = subjectFilter === 'All' ? searches : searches.filter(s => s.subject === subjectFilter)
  const allSubjects = ['All', ...Object.keys(subjectCounts)]

  const atRiskStudents = students.filter(s => {
    if (!s.last_active) return true
    const days = (Date.now() - new Date(s.last_active).getTime()) / 86400000
    return days > 5
  })

  const todaySearches = searches.filter(s => new Date(s.searched_at).toDateString() === new Date().toDateString())

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6B6560' }}>ஏற்றுகிறோம்...</div>

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>கற்றல் நுண்ணறிவு</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>மாணவர்கள் விதுவிடம் கேட்ட கேள்விகள் — {teacher.schoolCode}</div>
      </div>

      {searches.length === 0 && students.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', border: '1px solid #E2DDD7' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', marginBottom: 8 }}>இன்னும் கேள்விகள் இல்லை</div>
          <div style={{ fontSize: 13, color: '#6B6560' }}>மாணவர்கள் விதுவிடம் கேள்விகள் கேட்கும்போது இங்கே தோன்றும்</div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'மொத்த கேள்விகள்',  value: searches.length,                                    icon: '💬', color: '#1B3A6B', bg: '#E6EEF8' },
              { label: 'இன்று கேள்விகள்',  value: todaySearches.length,                               icon: '📅', color: '#2D7A5F', bg: '#E1F0E9' },
              { label: 'செயலில் மாணவர்',   value: new Set(searches.map(s => s.student_id)).size,      icon: '👦', color: '#E8A020', bg: '#FDF3E0' },
              { label: 'கவனம் தேவை',       value: atRiskStudents.length,                              icon: '⚠️', color: '#C45C3A', bg: '#FAEAE4' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6B6560', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { id: 'overview',       label: '📊 பாட வரைபடம்'    },
              { id: 'topics',         label: '🔥 Top தலைப்புகள்'  },
              { id: 'students',       label: '👦 மாணவர் வரலாறு'  },
              { id: 'atrisk',         label: '⚠️ கவனம் தேவை'     },
              { id: 'timeline',       label: '🕐 கேள்வி வரலாறு'  },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2DDD7', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: activeTab === tab.id ? '#1B3A6B' : '#fff',
                  color: activeTab === tab.id ? '#fff' : '#6B6560' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>எந்த பாடத்தில் அதிக கேள்விகள்?</div>
              {sortedSubjects.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6B6560', padding: 20 }}>கேள்விகள் இல்லை</div>
              ) : sortedSubjects.map(([subject, count]) => {
                const sc = SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other
                return (
                  <div key={subject} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{subject}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: sc.color }}>{count}</span>
                        <span style={{ fontSize: 11, color: '#6B6560' }}>{Math.round((count / searches.length) * 100)}%</span>
                      </div>
                    </div>
                    <div style={{ background: '#F7F3ED', borderRadius: 8, height: 10 }}>
                      <div style={{ width: String((count / maxSubjectCount) * 100) + '%', background: sc.color, height: '100%', borderRadius: 8 }} />
                    </div>
                  </div>
                )
              })}
              {sortedSubjects.length > 0 && (
                <div style={{ marginTop: 16, background: '#FDF3E0', borderRadius: 10, padding: 12, fontSize: 13, color: '#6B6560' }}>
                  💡 <strong style={{ color: '#E8A020' }}>{sortedSubjects[0][0]}</strong>-ல் அதிக கேள்விகள் — வகுப்பில் கூடுதல் விளக்கம் தேவை
                </div>
              )}
            </div>
          )}

          {/* Topics */}
          {activeTab === 'topics' && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>அதிகமாக கேட்கப்பட்ட கேள்விகள்</div>
              {sortedTopics.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6B6560', padding: 20 }}>கேள்விகள் இல்லை</div>
              ) : sortedTopics.map(([question, data], i) => {
                const sc = SUBJECT_COLORS[data.subject] || SUBJECT_COLORS.Other
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < sortedTopics.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#6B6560', minWidth: 24, marginTop: 2 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612', marginBottom: 4 }}>{question}{question.length >= 60 ? '...' : ''}</div>
                      <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{data.subject}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{data.count}x</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Students */}
          {activeTab === 'students' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>
                மாணவர் கேள்வி வரலாறு — கிளிக் செய்து விவரம் பாருங்கள்
              </div>
              {students.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#6B6560' }}>மாணவர்கள் பதிவு செய்யவில்லை</div>
              ) : students.map((s, i) => (
                <div key={s.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < students.length - 1 ? '1px solid #E2DDD7' : 'none', cursor: 'pointer', background: 'white' }}
                  onClick={() => loadStudentDetail(s)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F7F3ED')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E6EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>
                    {s.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>Roll: {s.roll_number} • {s.class}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1B3A6B' }}>{s.questions_asked || 0}</div>
                    <div style={{ fontSize: 11, color: '#6B6560' }}>கேள்விகள்</div>
                  </div>
                  <div style={{ color: '#6B6560', fontSize: 18 }}>›</div>
                </div>
              ))}
            </div>
          )}

          {/* Student detail */}
          {activeTab === 'student-detail' && selectedStudent && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <button onClick={() => setActiveTab('students')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2DDD7', background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B6560' }}>
                  ← திரும்பு
                </button>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1B3A6B' }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: 12, color: '#6B6560' }}>Roll: {selectedStudent.roll_number} • {selectedStudent.class} • {selectedStudent.questions_asked || 0} கேள்விகள்</div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>
                  💬 விதுவிடம் கேட்ட கேள்விகள்
                </div>
                {searches.filter(s => s.student_id === selectedStudent.id).length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#6B6560', fontSize: 13 }}>இன்னும் கேள்விகள் இல்லை</div>
                ) : searches.filter(s => s.student_id === selectedStudent.id).map((s, i, arr) => {
                  const sc = SUBJECT_COLORS[s.subject] || SUBJECT_COLORS.Other
                  return (
                    <div key={s.id} style={{ padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{s.subject}</span>
                        <span style={{ fontSize: 11, color: '#6B6560' }}>{new Date(s.searched_at).toLocaleDateString('ta-IN')}</span>
                      </div>
                      <div style={{ fontSize: 14, color: '#1A1612', fontWeight: 500 }}>❓ {s.question}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>
                  🔖 சேமித்த பதில்கள் (கேள்வி + விதுவின் பதில்)
                </div>
                {studentReplies.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#6B6560', fontSize: 13 }}>இன்னும் பதில்கள் சேமிக்கவில்லை</div>
                ) : studentReplies.map((r, i) => {
                  const sc = SUBJECT_COLORS[r.subject || 'Other'] || SUBJECT_COLORS.Other
                  const isExpanded = expandedSearch === r.id
                  return (
                    <div key={r.id} style={{ borderBottom: i < studentReplies.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                      <div style={{ padding: '14px 20px', cursor: 'pointer' }}
                        onClick={() => setExpandedSearch(isExpanded ? null : r.id)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{r.subject || 'Other'}</span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ fontSize: 11, color: '#6B6560' }}>{new Date(r.saved_at).toLocaleDateString('ta-IN')}</span>
                            <span style={{ fontSize: 12, color: '#6B6560' }}>{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, color: '#1A1612', fontWeight: 500 }}>❓ {r.question}</div>
                      </div>
                      {isExpanded && (
                        <div style={{ padding: '0 20px 16px', background: '#F7F3ED' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B', marginBottom: 8 }}>🦉 விதுவின் பதில்:</div>
                          <div style={{ fontSize: 13, color: '#1A1612', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {r.answer.replace(/\*\*/g, '').replace(/###/g, '').replace(/##/g, '')}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* At Risk */}
          {activeTab === 'atrisk' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', fontSize: 15, fontWeight: 700, color: '#C45C3A' }}>
                ⚠️ கவனம் தேவைப்படும் மாணவர்கள் — 5 நாட்களுக்கும் மேலாக விதுவிடம் கேள்விகள் கேட்கவில்லை
              </div>
              {atRiskStudents.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#2D7A5F', fontSize: 14, fontWeight: 600 }}>
                  ✅ அனைத்து மாணவர்களும் செயலில் உள்ளனர்!
                </div>
              ) : atRiskStudents.map((s, i) => {
                const lastActive = s.last_active ? new Date(s.last_active).toLocaleDateString('ta-IN') : 'உள்நுழையவில்லை'
                const days = s.last_active ? Math.floor((Date.now() - new Date(s.last_active).getTime()) / 86400000) : null
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < atRiskStudents.length - 1 ? '1px solid #E2DDD7' : 'none', background: '#FFFAF9' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FAEAE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#C45C3A' }}>
                      {s.name?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#6B6560', marginTop: 2 }}>Roll: {s.roll_number} • கடைசியாக: {lastActive}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {days !== null && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#C45C3A' }}>{days} நாட்கள்</div>
                      )}
                      <div style={{ fontSize: 11, color: '#6B6560' }}>{s.questions_asked || 0} கேள்விகள்</div>
                    </div>
                  </div>
                )
              })}
              {atRiskStudents.length > 0 && (
                <div style={{ padding: '12px 20px', background: '#FAEAE4', fontSize: 13, color: '#C45C3A' }}>
                  💡 இந்த மாணவர்களிடம் வகுப்பில் பேசி, கல்வி.AI-யை மீண்டும் பயன்படுத்த ஊக்குவியுங்கள்
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>அனைத்து கேள்விகளும் — நேர வரிசை</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {allSubjects.map(sub => (
                    <button key={sub} onClick={() => setSubjectFilter(sub)}
                      style={{ padding: '5px 10px', borderRadius: 20, border: '1px solid #E2DDD7', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                        background: subjectFilter === sub ? '#1B3A6B' : '#fff',
                        color: subjectFilter === sub ? '#fff' : '#6B6560' }}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
              {filteredSearches.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#6B6560' }}>கேள்விகள் இல்லை</div>
              ) : filteredSearches.map((s, i) => {
                const sc = SUBJECT_COLORS[s.subject] || SUBJECT_COLORS.Other
                const studentName = s.students?.name || 'Unknown'
                return (
                  <div key={s.id} style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: i < filteredSearches.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: sc.color, flexShrink: 0 }}>
                      {studentName[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{studentName}</span>
                        <span style={{ fontSize: 11, color: '#6B6560' }}>{new Date(s.searched_at).toLocaleString('ta-IN')}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 4 }}>{s.question}</div>
                      <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{s.subject}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
