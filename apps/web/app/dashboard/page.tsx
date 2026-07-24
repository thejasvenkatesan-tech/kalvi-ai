'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import OverviewPanel from '@/components/dashboard/OverviewPanel'
import StudentsPanel from '@/components/dashboard/StudentsPanel'
import SessionsPanel from '@/components/dashboard/SessionsPanel'
import MissionsPanel from '@/components/dashboard/MissionsPanel'

export type ActivePanel = 'overview' | 'students' | 'sessions' | 'missions'

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('overview')

  // Mock teacher data — will come from Supabase later
  const teacher = {
    name: 'அண்ணாமலை',
    school: 'அரசு உயர்நிலை பள்ளி, தர்மபுரி',
    className: '8A',
    schoolCode: 'KA8042',
    district: 'தர்மபுரி',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F3ED', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar teacher={teacher} activePanel={activePanel} setActivePanel={setActivePanel} />
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {activePanel === 'overview'  && <OverviewPanel teacher={teacher} />}
        {activePanel === 'students'  && <StudentsPanel teacher={teacher} />}
        {activePanel === 'sessions'  && <SessionsPanel teacher={teacher} />}
        {activePanel === 'missions'  && <MissionsPanel teacher={teacher} />}
      </main>
    </div>
  )
}
