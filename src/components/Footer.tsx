export default function Footer() {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Blog Uygulaması. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 