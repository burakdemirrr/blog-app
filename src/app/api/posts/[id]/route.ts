import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!params?.id) {
      return NextResponse.json(
        { error: 'Blog yazısı ID\'si gerekli' },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Sadece yazının sahibi görebilir
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu yazıya erişim yetkiniz yok' },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog yazısı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!params?.id) {
      return NextResponse.json(
        { error: 'Blog yazısı ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Önce yazıyı kontrol et
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Sadece yazının sahibi silebilir
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu yazıyı silme yetkiniz yok' },
        { status: 403 }
      );
    }

    // Yazıyı sil
    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Blog yazısı başarıyla silindi' });
  } catch (error) {
    console.error('Blog yazısı silme hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazısı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 