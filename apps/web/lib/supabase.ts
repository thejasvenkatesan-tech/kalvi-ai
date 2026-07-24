import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function loginTeacher(mobile: string, pin: string, schoolCode: string) {
  const { data: school } = await supabase
    .from('schools')
    .select('id, name, district, code')
    .eq('code', schoolCode.toUpperCase())
    .single()

  if (!school) return { error: 'பள்ளி கோட் சரியில்லை' }

  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('mobile', mobile.trim())
    .eq('school_id', school.id)
    .single()

  if (!teacher) return { error: 'Mobile number பதிவு செய்யவில்லை' }
  if (teacher.pin_hash !== pin) return { error: 'PIN சரியில்லை' }

  return { teacher, school }
}

export async function registerStudent(schoolId: string, name: string, rollNumber: string, classSection: string, pin: string) {
  const { data, error } = await supabase
    .from('students')
    .insert({ school_id: schoolId, name, roll_number: rollNumber, class: classSection, pin_hash: pin })
    .select()
    .single()
  return { data, error }
}

export async function getStudents(schoolId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('school_id', schoolId)
    .order('roll_number')
  return { data, error }
}

export async function getTopicSearches(schoolId: string) {
  const { data, error } = await supabase
    .from('topic_searches')
    .select('*, students(name, roll_number, class)')
    .eq('school_id', schoolId)
    .order('searched_at', { ascending: false })
  return { data, error }
}

export async function getSavedReplies(studentId: string) {
  const { data, error } = await supabase
    .from('saved_replies')
    .select('*')
    .eq('student_id', studentId)
    .order('saved_at', { ascending: false })
  return { data, error }
}
