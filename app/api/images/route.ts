import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images')
    const files = await readdir(imagesDir)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    return NextResponse.json({ images: imageFiles })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
