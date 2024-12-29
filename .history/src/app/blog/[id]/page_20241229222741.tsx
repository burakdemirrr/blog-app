import React from 'react';
import { posts } from '@/data/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </nav>
        
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <span className="text-blue-600">{post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
            {post.content.split('\n').map((paragraph, index) => {
              const trimmedParagraph = paragraph.trim();
              if (!trimmedParagraph) return null;
              
              if (trimmedParagraph.startsWith('-')) {
                return (
                  <ul key={index} className="list-disc list-inside">
                    <li className="text-gray-600">{trimmedParagraph.slice(1).trim()}</li>
                  </ul>
                );
              }
              
              return (
                <p key={index} className="mb-4">
                  {trimmedParagraph}
                </p>
              );
            })}
          </div>
        </article>
      </main>
    </div>
  );
} 