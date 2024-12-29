'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBlogPost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
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
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </nav>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-indigo-50">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Yeni Blog Yazısı
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-indigo-900 mb-2">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Blog yazınızın başlığı"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-indigo-900 mb-2">
                İçerik
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                className="w-full px-4 py-2 rounded-lg border border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Blog yazınızın içeriği..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'} 
                transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              {isSubmitting ? 'Yayınlanıyor...' : 'Yayınla'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 