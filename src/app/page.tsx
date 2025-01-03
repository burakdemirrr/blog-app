'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?message=Lütfen önce giriş yapın');
      return;
    }

    if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, router]);

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Blog yazıları yüklenemedi');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Blog Yazılarım
          </h1>
          <p className="text-xl text-gray-400 mb-8">Teknoloji ve web geliştirme üzerine düşüncelerim</p>
          
          <Link 
            href="/blog/new"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium 
              hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Yazı Ekle
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-400">
            Henüz blog yazısı bulunmuyor. Yeni bir yazı ekleyerek başlayın!
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map(post => (
              <article 
                key={post.id} 
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-800 hover:border-gray-700"
              >
                {post.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={800}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-sm text-indigo-400 mb-4 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')} • {post.author.name || post.author.email}
                  </div>
                  
                  <Link href={`/blog/${post.id}`} className="group">
                    <h2 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link 
                    href={`/blog/${post.id}`} 
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Devamını Oku 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
