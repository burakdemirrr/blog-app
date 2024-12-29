'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NewBlogPost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?message=Önce giriş yapmalısınız');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-indigo-400">Yükleniyor...</div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorId: session.user.id
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Blog yazısı eklenirken bir hata oluştu');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
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

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-800">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">
            Yeni Blog Yazısı
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                placeholder="Blog yazınızın başlığı"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                İçerik
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                placeholder="Blog yazınızın içeriği..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-600'} 
                transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50`}
            >
              {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 