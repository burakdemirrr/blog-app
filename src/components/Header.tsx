import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-indigo-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Site Adı */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Blog
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link 
              href="/" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/blog/new" 
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              Yeni Yazı
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 