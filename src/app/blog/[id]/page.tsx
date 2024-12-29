'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string | null;
    email: string | null;
  };
  createdAt: string;
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?message=Lütfen önce giriş yapın');
      return;
    }

    if (status === 'authenticated' && params.id) {
      fetchPost();
    }
  }, [status, params.id, router]);

  async function fetchPost() {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/posts/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          router.replace('/?message=Bu yazıya erişim yetkiniz yok');
          return;
        }
        throw new Error(data || 'Blog yazısı yüklenemedi');
      }

      setPost(data);
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-indigo-400">Yükleniyor...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 text-red-400 text-center">
            {error}
          </div>
          <div className="mt-4 text-center">
            <Link 
              href="/"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </nav>

        <article className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-800">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              {post.title}
            </h1>
            <div className="text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('tr-TR')} • {post.author.name || post.author.email}
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
} 