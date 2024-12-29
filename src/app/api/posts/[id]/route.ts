import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params?.id) {
      return new NextResponse('Blog yazısı ID\'si gerekli', { status: 400 });
    }

    const postId = params.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
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

    if (!post) {
      return new NextResponse('Blog yazısı bulunamadı', { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse('Bu blog yazısını görüntüleme yetkiniz yok', { status: 403 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Post fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 