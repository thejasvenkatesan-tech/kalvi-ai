import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Helper types ───────────────────────────────────────────────
export type School = {
  id: string
  name: string
  district: string
  code: string
}

export type Teacher = {
  id: string
  school_id: string
  name: string
  class_name: string
}

export type Student = {
  id: string
  school_id: string
  name: string
  class: string
  roll_number: string
  pin_hash: string
  questions_asked: number
  last_active: string | null
}

export type TopicSearch = {
  id: string
  student_id: string
  school_id: string
  class: string
  subject: string
  topic: string | null
  question: string
  searched_at: string
}

// ── Auth helpers ───────────────────────────────────────────────
export async function loginStudent(schoolCode: string, rollNumber: string, name: string, pin: string) {
  // Get school
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('code', schoolCode)
    .single()

  if (!school) return { error: 'School not found' }

  // Get student
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', school.id)
    .eq('roll_number', rollNumber)
    .single()

  if (!student) return { error: 'Student not found' }

  // Check name (first 2 chars match)
  if (!student.name.includes(name.trim().slice(0, 2))) {
    return { error: 'Name does not match' }
  }

  // Check PIN (plain text for now)
  if (student.pin_hash !== pin) return { error: 'PIN incorrect' }

  // Update last active
  await supabase
    .from('students')
    .update({ last_active: new Date().toISOString() })
    .eq('id', student.id)

  return { student, school }
}

// ── Register student ───────────────────────────────────────────
export async function registerStudent(schoolId: string, name: string, rollNumber: string, cls: string, pin: string) {
  const { data, error } = await supabase
    .from('students')
    .insert({ school_id: schoolId, name, roll_number: rollNumber, class: cls, pin_hash: pin })
    .select()
    .single()

  return { data, error }
}

// ── Get students by school ─────────────────────────────────────
export async function getStudents(schoolId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', schoolId)
    .order('roll_number')

  return { data, error }
}

// ── Log topic search ───────────────────────────────────────────
export async function logTopicSearch(studentId: string, schoolId: string, cls: string, subject: string, question: string) {
  const { error } = await supabase
    .from('topic_searches')
    .insert({ student_id: studentId, school_id: schoolId, class: cls, subject, question })

  return { error }
}

// ── Get topic searches by school ───────────────────────────────
export async function getTopicSearches(schoolId: string) {
  const { data, error } = await supabase
    .from('topic_searches')
    .select('*')
    .eq('school_id', schoolId)
    .order('searched_at', { ascending: false })

  return { data, error }
}

// ── Save reply ─────────────────────────────────────────────────
export async function saveReply(studentId: string, question: string, answer: string, subject: string) {
  const { error } = await supabase
    .from('saved_replies')
    .insert({ student_id: studentId, question, answer, subject })

  return { error }
}

// ── Increment questions asked ──────────────────────────────────
export async function incrementQuestionsAsked(studentId: string) {
  const { error } = await supabase.rpc('increment_questions', { student_id: studentId })
  return { error }
}
