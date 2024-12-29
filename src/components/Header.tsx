'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-indigo-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Site Adı */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Blog
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Ana Sayfa
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/blog/new" 
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Yeni Yazı
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-indigo-800/70">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/login" 
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
                    hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 