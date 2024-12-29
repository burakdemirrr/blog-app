import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    return {
      title: 'Blog Yazısı Bulunamadı',
      description: 'İstenen blog yazısı bulunamadı.',
    };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
      select: {
        title: true,
        content: true,
        excerpt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return {
        title: 'Blog Yazısı Bulunamadı',
        description: 'İstenen blog yazısı bulunamadı.',
      };
    }

    const description = post.excerpt || post.content.slice(0, 150);

    return {
      title: `${post.title} | Blog`,
      description,
      openGraph: {
        title: post.title,
        description,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
      },
    };
  } catch (error) {
    console.error('Metadata yüklenirken hata:', error);
    return {
      title: 'Blog Yazısı',
      description: 'Blog yazısı detay sayfası',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [session, resolvedParams] = await Promise.all([
    getServerSession(authOptions),
    params
  ]);

  if (!session) {
    redirect('/auth/login?message=Lütfen önce giriş yapın');
  }

  if (!resolvedParams?.id) {
    redirect('/?message=Geçersiz blog yazısı');
  }

  return <BlogPostClient params={resolvedParams} />;
}
