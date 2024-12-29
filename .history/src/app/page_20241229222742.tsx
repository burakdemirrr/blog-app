import { posts } from '@/data/posts';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog Yazılarım</h1>
          <p className="text-xl text-gray-600">Teknoloji ve web geliştirme üzerine düşüncelerim</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-4">
                  {post.date} • {post.author}
                </div>
                
                <Link href={`/blog/${post.id}`} className="group">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blog/${post.id}`} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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
      </main>
    </div>
  );
}
