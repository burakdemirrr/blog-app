import { posts } from '@/data/posts';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Blog Yazılarım
          </h1>
          <p className="text-xl text-indigo-600/80">Teknoloji ve web geliştirme üzerine düşüncelerim</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <article 
              key={post.id} 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-50 hover:border-indigo-100"
            >
              <div className="p-6">
                <div className="text-sm text-indigo-500 mb-4 font-medium">
                  {post.date} • {post.author}
                </div>
                
                <Link href={`/blog/${post.id}`} className="group">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-indigo-800/80 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blog/${post.id}`} 
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
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
