import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || ''
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Fetch all schools ──────────────────────────────────────────
export async function fetchSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, district, code')
    .order('name')
  return { data, error }
}

// ── Search schools by query ─────────────────────────────────────
export async function searchSchools(query) {
  if (!query || query.length < 2) return { data: [], error: null }
  const { data, error } = await supabase
    .from('schools')
    .select('id, name, district, code')
    .or(`name.ilike.%${query}%,district.ilike.%${query}%,code.ilike.%${query}%`)
    .order('name')
    .limit(4)
  return { data, error }
}

// ── Login student ──────────────────────────────────────────────
export async function loginStudent(schoolId, rollNumber, name, pin) {
  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', schoolId)
    .eq('roll_number', rollNumber)
    .single()

  if (error || !student) return { error: 'மாணவர் கணக்கு கிடைக்கவில்லை' }
  if (!student.name.includes(name.trim().slice(0, 2))) return { error: 'பெயர் சரியில்லை' }
  if (student.pin_hash !== pin) return { error: 'PIN சரியில்லை' }

  // Update last active
  await supabase
    .from('students')
    .update({ last_active: new Date().toISOString() })
    .eq('id', student.id)

  return { student }
}

// ── Log topic search ───────────────────────────────────────────
export async function logTopicSearch(studentId, schoolId, cls, subject, question) {
  await supabase
    .from('topic_searches')
    .insert({ student_id: studentId, school_id: schoolId, class: cls, subject, question })
}

// ── Save reply ─────────────────────────────────────────────────
export async function saveReplyToDb(studentId, question, answer, subject) {
  await supabase
    .from('saved_replies')
    .insert({ student_id: studentId, question, answer, subject })
}

// ── Increment questions asked ──────────────────────────────────
export async function incrementQuestions(studentId) {
  const { data: student } = await supabase
    .from('students')
    .select('questions_asked')
    .eq('id', studentId)
    .single()

  if (student) {
    await supabase
      .from('students')
      .update({ questions_asked: (student.questions_asked || 0) + 1 })
      .eq('id', studentId)
  }
}
