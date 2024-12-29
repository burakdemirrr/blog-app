'use client';

import { useEffect, useState, useCallback, memo, Suspense, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components
const DeleteModal = lazy(() => import('./DeleteModal'));
const BlogContent = lazy(() => import('./components/BlogContent'));
const Logo = lazy(() => import('./components/Logo'));

// Loading component
const LoadingSpinner = memo(() => (
  <motion.div 
    className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Error component
const ErrorDisplay = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <motion.div 
    className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        className="bg-red-900/50 border border-red-800 rounded-lg p-4 text-red-400 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {error}
      </motion.div>
      <motion.div 
        className="mt-4 text-center space-x-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link 
          href="/"
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Ana Sayfaya Dön
        </Link>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Tekrar Dene
          </button>
        )}
      </motion.div>
    </div>
  </motion.div>
));
ErrorDisplay.displayName = 'ErrorDisplay';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  author: {
    name: string | null;
    email: string | null;
  };
  createdAt: string;
}

interface Props {
  params: {
    id: string;
  };
}

export default function BlogPostClient({ params }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!params?.id) return;

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/posts/${params.id}`, {
        next: { revalidate: 60 }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/auth/login?message=Lütfen önce giriş yapın');
          return;
        }
        if (response.status === 403) {
          router.replace('/?message=Bu yazıya erişim yetkiniz yok');
          return;
        }
        throw new Error(data.error || 'Blog yazısı yüklenemedi');
      }

      setPost(data);
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [params?.id, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?message=Lütfen önce giriş yapın');
      return;
    }

    if (status === 'authenticated' && !post && !error) {
      fetchPost();
    }
  }, [status, fetchPost, post, error]);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı silinemedi');
      }

      router.replace('/?message=Blog yazısı başarıyla silindi');
    } catch (error) {
      console.error('Blog yazısı silinirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }, [params?.id, router]);

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchPost} />;
  }

  if (!post) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav 
          className="mb-8 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link 
              href="/"
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-all duration-300"
            >
              <Suspense fallback={null}>
                <Logo />
              </Suspense>
              <span className="ml-2 font-medium">Ana Sayfa</span>
            </Link>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/blog/new"
                className="inline-flex items-center px-4 py-2 border border-indigo-500 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Yazı
              </Link>
            </motion.div>

            <motion.button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-red-500 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Sil
            </motion.button>
          </motion.div>
        </motion.nav>

        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <BlogContent post={post} />
          </AnimatePresence>
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </Suspense>
    </motion.div>
  );
} 