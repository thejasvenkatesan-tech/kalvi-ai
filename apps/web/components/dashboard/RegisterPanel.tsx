'use client'

import { useState } from 'react'

const EXISTING_STUDENTS = [
  { roll: '001', name: 'பிரியா',      cls: '8', pin: '1234' },
  { roll: '002', name: 'அர்ஜுன்',    cls: '8', pin: '2345' },
  { roll: '003', name: 'கவிதா',      cls: '8', pin: '3456' },
  { roll: '004', name: 'முருகன்',    cls: '8', pin: '4567' },
  { roll: '005', name: 'சரண்யா',    cls: '8', pin: '5678' },
  { roll: '006', name: 'விக்ரம்',    cls: '8', pin: '6789' },
  { roll: '007', name: 'தேவி',       cls: '8', pin: '7890' },
  { roll: '008', name: 'கார்த்திக்', cls: '8', pin: '8901' },
]

function generatePIN() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export default function RegisterPanel({ teacher }: { teacher: { className: string; schoolCode: string } }) {
  const [students, setStudents] = useState(EXISTING_STUDENTS)
  const [name, setName]         = useState('')
  const [roll, setRoll]         = useState('')
  const [cls, setCls]           = useState('8')
  const [pin, setPin]           = useState(generatePIN())
  const [saved, setSaved]       = useState(false)
  const [showPins, setShowPins] = useState(false)

  function addStudent() {
    if (!name.trim() || !roll.trim()) return
    setStudents(s => [...s, { roll: roll.trim(), name: name.trim(), cls, pin }])
    setName('')
    setRoll('')
    setPin(generatePIN())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function printSlips() {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>கல்வி.AI Login Slips</title>
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  h2 { color: #1B3A6B; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .slip { border: 2px dashed #1B3A6B; border-radius: 10px; padding: 14px; page-break-inside: avoid; }
  .slip-title { font-size: 13px; font-weight: bold; color: #1B3A6B; margin-bottom: 8px; }
  .slip-school { font-size: 11px; color: #6B6560; margin-bottom: 10px; }
  .slip-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #E2DDD7; font-size: 13px; }
  .slip-label { color: #6B6560; }
  .slip-value { font-weight: bold; color: #1A1612; }
  .slip-pin { font-size: 22px; font-weight: 800; color: #1B3A6B; text-align: center; margin-top: 10px; letter-spacing: 6px; }
  .slip-warning { font-size: 10px; color: #C45C3A; text-align: center; margin-top: 6px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<h2>🦉 கல்வி.AI — Login Slips | ${teacher.className} | School: ${teacher.schoolCode}</h2>
<div class="grid">
${students.map(s => `
  <div class="slip">
    <div class="slip-title">🦉 கல்வி.AI Login</div>
    <div class="slip-school">${teacher.schoolCode} • ${teacher.className}</div>
    <div class="slip-row"><span class="slip-label">பெயர்</span><span class="slip-value">${s.name}</span></div>
    <div class="slip-row"><span class="slip-label">Roll No</span><span class="slip-value">${s.roll}</span></div>
    <div class="slip-pin">${s.pin}</div>
    <div class="slip-warning">⚠️ இந்த PIN-ஐ யாரிடமும் சொல்லாதே</div>
  </div>
`).join('')}
</div>
</body>
</html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); w.print() }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1B3A6B' }}>மாணவர் பதிவு</div>
        <div style={{ fontSize: 13, color: '#6B6560', marginTop: 4 }}>
          மாணவர்களை சேர்க்க, PIN தரிசனம் செய்க, Login Slips print செய்க
        </div>
      </div>

      {/* Add student form */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2DDD7', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B', marginBottom: 16 }}>➕ புதிய மாணவர் சேர்க்க</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 120px', gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 6, fontWeight: 600 }}>பெயர்</div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="மாணவர் பெயர்..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 14, boxSizing: 'border-box' as const, outline: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 6, fontWeight: 600 }}>Roll Number</div>
            <input value={roll} onChange={e => setRoll(e.target.value)}
              placeholder="உதா: 009"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 14, boxSizing: 'border-box' as const, outline: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 6, fontWeight: 600 }}>வகுப்பு</div>
            <select value={cls} onChange={e => setCls(e.target.value)}
              style={{ width: '100%', padding: '10px 8px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 14, outline: 'none' }}>
              {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B6560', marginBottom: 6, fontWeight: 600 }}>PIN (auto)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={pin} onChange={e => setPin(e.target.value.slice(0,4))}
                maxLength={4}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #E2DDD7', fontSize: 16, fontWeight: 700, letterSpacing: 4, outline: 'none' }} />
              <button onClick={() => setPin(generatePIN())}
                style={{ padding: '10px 8px', borderRadius: 8, border: '1px solid #E2DDD7', background: '#F7F3ED', cursor: 'pointer', fontSize: 14 }}>🔄</button>
            </div>
          </div>
        </div>
        <button onClick={addStudent}
          style={{ background: '#1B3A6B', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {saved ? '✅ சேமிக்கப்பட்டது!' : '➕ மாணவரை சேர்க்க'}
        </button>
      </div>

      {/* Student list + print */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DDD7', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1B3A6B' }}>
            பதிவு செய்யப்பட்ட மாணவர்கள் ({students.length})
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowPins(p => !p)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2DDD7', background: '#F7F3ED', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#6B6560' }}>
              {showPins ? '🙈 PINs மறை' : '👁 PINs காட்டு'}
            </button>
            <button onClick={printSlips}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1B3A6B', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              🖨️ Login Slips Print
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F3ED', borderBottom: '1px solid #E2DDD7' }}>
              {['Roll', 'பெயர்', 'வகுப்பு', 'PIN'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B6560', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.roll} style={{ borderBottom: i < students.length - 1 ? '1px solid #E2DDD7' : 'none' }}>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#6B6560' }}>{s.roll}</td>
                <td style={{ padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{s.name}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#6B6560' }}>{s.cls}ஆம்</td>
                <td style={{ padding: '10px 16px', fontSize: 16, fontWeight: 800, color: '#1B3A6B', letterSpacing: 4 }}>
                  {showPins ? s.pin : '••••'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#E1F0E9', borderRadius: 10, padding: 12, marginTop: 16, fontSize: 13, color: '#2D7A5F' }}>
        💡 Login Slips print செய்து, ஒவ்வொரு மாணவருக்கும் ஒரு slip கொடுங்கள். மாணவர்கள் Roll Number + PIN பயன்படுத்தி login செய்வார்கள்.
      </div>
    </div>
  )
}
