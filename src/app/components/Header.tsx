'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

const Header = () => {
  const { data: session, status } = useSession();

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  return (
    <motion.header 
      className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xl">B</span>
              </motion.div>
              <span className="text-gray-100 font-semibold text-lg hidden sm:block">Blog</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Ana Sayfa
              </Link>
              {session && (
                <Link 
                  href="/blog/new"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Yeni Yazı
                </Link>
              )}
            </nav>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {status === 'loading' ? (
              <motion.div 
                className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-300">
                    Merhaba, <span className="font-medium text-white">{session.user?.name || session.user?.email}</span>
                  </p>
                </div>
                <motion.button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Çıkış Yap
                </motion.button>
              </div>
            ) : (
              <Link href="/auth/login">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Giriş Yap
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 