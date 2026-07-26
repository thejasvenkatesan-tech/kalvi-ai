import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        })
      }
    )

    const data = await response.json()
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })

    const parts = data.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find((p: any) => p.inlineData)
    
    if (!imagePart) return NextResponse.json({ error: 'No image generated' }, { status: 400 })

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
    const filename = `diagrams/ai_${Date.now()}.png`
    
    const { error: uploadError } = await supabase.storage
      .from('textbook-diagrams')
      .upload(filename, imageBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('textbook-diagrams')
      .getPublicUrl(filename)

    return NextResponse.json({ imageUrl: urlData.publicUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
