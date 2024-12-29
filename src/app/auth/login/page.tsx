'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || 'Giriş yapılırken bir hata oluştu');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Giriş Yap
          </h1>
          <p className="mt-2 text-gray-400">
            Blog yazılarınıza erişmek için giriş yapın
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-800">
          {message && (
            <div className="mb-4 p-4 bg-indigo-900/50 border border-indigo-800 rounded-lg text-indigo-400 text-sm text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-600'} 
                transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50`}
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 