import { posts } from '@/data/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Ana Sayfaya Dön
      </Link>
      
      <article className="mt-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <span>{post.date}</span> • <span>{post.author}</span>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
} 