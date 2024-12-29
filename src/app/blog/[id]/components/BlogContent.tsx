'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

const BlogContent = memo(({ post }: { post: Post }) => (
  <motion.article 
    className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", damping: 20 }}
    whileHover={{ scale: 1.02 }}
  >
    {post.imageUrl && (
      <motion.div 
        className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={630}
          className="object-cover w-full h-full"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
        />
      </motion.div>
    )}

    <motion.header 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
        whileHover={{ color: "#818cf8", scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {post.title}
      </motion.h1>
      <motion.div 
        className="text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {new Date(post.createdAt).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} • {post.author.name || post.author.email}
      </motion.div>
    </motion.header>

    <motion.div 
      className="prose prose-invert max-w-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {post.content.split('\n').map((paragraph, index) => (
        paragraph.trim() && (
          <motion.p 
            key={index} 
            className="mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            whileHover={{ x: 10, color: "#d1d5db" }}
          >
            {paragraph}
          </motion.p>
        )
      ))}
    </motion.div>
  </motion.article>
));

BlogContent.displayName = 'BlogContent';

export default BlogContent; 