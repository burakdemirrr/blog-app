import React from 'react';
import { posts } from '@/data/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </nav>
        
        <article className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-indigo-50">
          <header className="mb-8 pb-8 border-b border-indigo-100">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {post.title}
            </h1>
            <div className="flex items-center text-indigo-600">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2 text-indigo-300">•</span>
              <time dateTime={post.date} className="text-indigo-500">{post.date}</time>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none prose-headings:text-indigo-900 prose-p:text-indigo-800/80 prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
            {post.content.split('\n').map((paragraph, index) => {
              const trimmedParagraph = paragraph.trim();
              if (!trimmedParagraph) return null;
              
              if (trimmedParagraph.startsWith('-')) {
                return (
                  <ul key={index} className="list-disc list-inside">
                    <li className="text-indigo-800/80">{trimmedParagraph.slice(1).trim()}</li>
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
      </div>
    </div>
  );
} 