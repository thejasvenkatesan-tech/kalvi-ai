'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import OverviewPanel from '@/components/dashboard/OverviewPanel'
import StudentsPanel from '@/components/dashboard/StudentsPanel'
import InsightsPanel from '@/components/dashboard/InsightsPanel'
import RegisterPanel from '@/components/dashboard/RegisterPanel'
import LoginPage from '@/components/dashboard/LoginPage'

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState('overview')
  const [teacher, setTeacher]         = useState<any>(null)
  const [school, setSchool]           = useState<any>(null)

  function handleLogin(t: any, s: any) {
    setTeacher(t)
    setSchool(s)
  }

  function handleLogout() {
    setTeacher(null)
    setSchool(null)
    setActivePanel('overview')
  }

  if (!teacher) return <LoginPage onLogin={handleLogin} />

  const teacherData = {
    name:       teacher.name,
    school:     school.name,
    className:  teacher.class_name || 'All',
    schoolCode: school.code,
    district:   school.district,
    schoolId:   school.id,
    role:       teacher.role || 'teacher',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F3ED', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar teacher={teacherData} activePanel={activePanel} setActivePanel={setActivePanel} onLogout={handleLogout} />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {activePanel === 'overview'  && <OverviewPanel teacher={teacherData} />}
        {activePanel === 'students'  && <StudentsPanel teacher={teacherData} />}
        {activePanel === 'insights'  && <InsightsPanel teacher={teacherData} />}
        {activePanel === 'register'  && <RegisterPanel teacher={teacherData} />}
      </main>
    </div>
  )
}
