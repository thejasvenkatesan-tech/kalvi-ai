'use client'

import { useState } from 'react'
import { loginTeacher } from '@/lib/supabase'

export default function LoginPage({ onLogin }: { onLogin: (teacher: any, school: any) => void }) {
  const [mobile, setMobile]       = useState('')
  const [pin, setPin]             = useState('')
  const [schoolCode, setSchoolCode] = useState('')
  const [showPin, setShowPin]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  async function login() {
    if (!mobile.trim() || !pin || !schoolCode.trim()) {
      setError('அனைத்து தகவல்களும் தேவை')
      return
    }
    setLoading(true)
    setError('')
    const result = await loginTeacher(mobile.trim(), pin, schoolCode.trim())
    if (result.error) {
      setError(result.error)
    } else {
      onLogin(result.teacher, result.school)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🦉</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>கல்வி.AI</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Teacher Dashboard</div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1B3A6B', marginBottom: 6 }}>ஆசிரியர் உள்நுழைவு</div>
          <div style={{ fontSize: 13, color: '#6B6560', marginBottom: 24 }}>School Code, Mobile மற்றும் PIN கொடுக்கவும்</div>

          {/* School Code */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B6560', marginBottom: 6 }}>School Code</div>
            <input
              value={schoolCode}
              onChange={e => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="உதா: KA8042"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2DDD7', fontSize: 15, fontWeight: 700, letterSpacing: 2, boxSizing: 'border-box' as const, outline: 'none' }}
            />
          </div>

          {/* Mobile */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B6560', marginBottom: 6 }}>Mobile Number</div>
            <input
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="10 இலக்க mobile number"
              type="tel"
              maxLength={10}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2DDD7', fontSize: 15, boxSizing: 'border-box' as const, outline: 'none' }}
            />
          </div>

          {/* PIN */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B6560', marginBottom: 6 }}>PIN</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={pin}
                onChange={e => setPin(e.target.value.slice(0, 4))}
                placeholder="••••"
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2DDD7', fontSize: 18, fontWeight: 700, letterSpacing: 6, boxSizing: 'border-box' as const, outline: 'none' }}
              />
              <button
                onClick={() => setShowPin(p => !p)}
                style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid #E2DDD7', background: '#F7F3ED', cursor: 'pointer', fontSize: 13, color: '#6B6560', fontWeight: 600 }}>
                {showPin ? 'மறை' : 'காட்டு'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FAEAE4', border: '1px solid #C45C3A', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#C45C3A', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: loading ? '#6B6560' : '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {loading ? 'சரிபார்க்கிறோம்...' : 'உள்நுழை →'}
          </button>

          <div style={{ marginTop: 16, fontSize: 12, color: '#6B6560', textAlign: 'center' }}>
            PIN மறந்துவிட்டதா? உங்கள் பள்ளி நிர்வாகியிடம் தொடர்பு கொள்ளுங்கள்
          </div>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Demo Login:</div>
          <div style={{ fontSize: 13, color: '#E8A020', fontWeight: 600 }}>Code: KA8042 | Mobile: 9999999999 | PIN: 1234</div>
        </div>
      </div>
    </div>
  )
}
