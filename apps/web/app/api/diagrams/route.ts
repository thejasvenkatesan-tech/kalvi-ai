import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const subject = searchParams.get('subject') || 'Science'
  const cls = searchParams.get('class') || '8'

  if (!query) return NextResponse.json([])

  // Search by topic using text search
  const { data, error } = await supabase
    .from('diagram_library')
    .select('id, topic, description, public_url, type')
    .eq('useful_for_students', true)
    .ilike('topic', `%${query}%`)
    .limit(3)

  if (error) return NextResponse.json([])
  return NextResponse.json(data || [])
}
