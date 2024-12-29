import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, content } = await request.json();

    // Basit validasyon
    if (!title || !content) {
      return new NextResponse('Başlık ve içerik gerekli', { status: 400 });
    }

    // Blog yazısını oluştur
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: content.slice(0, 150) + '...',
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Sadece kullanıcının kendi yazılarını getir
    const posts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Post fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 