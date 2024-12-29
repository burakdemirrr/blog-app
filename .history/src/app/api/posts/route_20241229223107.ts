import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    // Yeni blog yazısı objesi oluştur
    const newPost = {
      id: Date.now().toString(), // Basit bir ID oluşturma yöntemi
      title,
      content,
      excerpt: content.slice(0, 150) + '...', // İlk 150 karakteri al
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD formatında
      author: 'Mehmet Bura'
    };

    // Mevcut posts dosyasını oku
    const postsPath = path.join(process.cwd(), 'src', 'data', 'posts.ts');
    const postsFile = await fs.readFile(postsPath, 'utf-8');
    
    // Mevcut posts array'ini çıkar
    const postsMatch = postsFile.match(/export const posts: BlogPost\[\] = \[([\s\S]*?)\];/);
    if (!postsMatch) {
      throw new Error('Posts array not found');
    }
    
    const currentPosts = postsMatch[1].trim();
    
    // Yeni post'u ekle
    const newPostStr = JSON.stringify(newPost, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // JSON'dan JavaScript object formatına çevir
      .replace(/^/gm, '  '); // Her satırın başına 2 boşluk ekle

    const updatedPosts = currentPosts 
      ? `${newPostStr},\n${currentPosts}` 
      : newPostStr;

    // Dosyayı güncelle
    const updatedContent = `import { BlogPost } from '@/types/blog';\n\nexport const posts: BlogPost[] = [\n${updatedPosts}\n];`;
    await fs.writeFile(postsPath, updatedContent, 'utf-8');

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error adding post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add post' },
      { status: 500 }
    );
  }
} 