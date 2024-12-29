import { posts } from '@/data/posts';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog Yazılarım</h1>
      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.id}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">{post.title}</h2>
            </Link>
            <div className="text-gray-600 mb-4">
              <span>{post.date}</span> • <span>{post.author}</span>
            </div>
            <p className="text-gray-700">{post.excerpt}</p>
            <Link href={`/blog/${post.id}`} className="mt-4 inline-block text-blue-600 hover:underline">
              Devamını Oku →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
