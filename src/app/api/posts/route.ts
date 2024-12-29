import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Başlık ve içerik gerekli' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: content.slice(0, 150) + '...',
        authorId: session.user.id,
        ...(imageUrl ? { imageUrl } : {}),
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    console.error('Blog yazıları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazıları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 