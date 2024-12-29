'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          >
            Blog
          </Link>

          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href="/blog/new"
                  className="text-gray-300 hover:text-indigo-400 transition-colors"
                >
                  Yeni Yazı
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-indigo-400 transition-colors"
                >
                  Çıkış Yap
                </button>
                <div className="text-gray-400">
                  {session.user?.name || session.user?.email}
                </div>
              </>
            ) : (
              <Link 
                href="/auth/login"
                className="text-gray-300 hover:text-indigo-400 transition-colors"
              >
                Giriş Yap
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 