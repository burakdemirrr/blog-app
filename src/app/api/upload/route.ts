import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Resim dosyası gerekli' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını benzersiz yap
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    
    // Resmi public/uploads klasörüne kaydet
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Resim yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 