import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScrollTo = (targetSelector: string) => {
    const target = document.querySelector(targetSelector) as HTMLElement | null;
    if (!target) return;
    const headerEl = document.querySelector('header') as HTMLElement | null;
    const headerOffset = headerEl ? headerEl.offsetHeight : 0;
    const extraGap = 8; // sedikit jarak agar tidak terlalu mepet
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - extraGap;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed w-full z-50 text-white transition-all duration-500 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.png" 
              alt="SimHire Logo" 
              className="h-10 w-auto"
            />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              SimHire
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { label: 'Beranda', href: '#home' },
              { label: 'Fitur', href: '#candidate-features' },
              { label: 'Cara Kerja', href: '#how-it-works' },
              { label: 'Dampak', href: '#impact' },
            ].map((item, index) => (
              <a 
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group py-2 px-1 hover:text-emerald-400 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/login" className="hidden lg:block px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105">
                  Masuk
                </Link>
                <Link to="/register" className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-emerald-500/25 relative overflow-hidden">
                  <span className="relative z-10">Mulai</span>
                  <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-500 ease-out will-change-transform"></span>
                </Link>
              </>
            )}
            {user && (
              <Link to="/dashboard/profile" className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow ${user.avatarColor||'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}>
                {user.name.charAt(0)}
              </Link>
            )}
          </div>
          
          <button 
            className="lg:hidden transform hover:scale-110 transition-transform duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-4 bg-gray-800/95 backdrop-blur-lg rounded-lg mt-2 mx-4">
            {[
              { label: 'Beranda', href: '#home' },
              { label: 'Fitur', href: '#candidate-features' },
              { label: 'Cara Kerja', href: '#how-it-works' },
              { label: 'Dampak', href: '#impact' },
            ].map((item, index) => (
              <a 
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-6 py-2 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 transform hover:translate-x-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            ))}
            <div className="px-6 py-2 space-y-2">
              {!user && (
                <>
                  <Link to="/login" className="w-full block text-left text-gray-300 hover:text-white transition-colors">
                    Masuk
                  </Link>
                  <Link to="/register" className="group w-full inline-flex justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden">
                    <span className="relative z-10">Mulai</span>
                    <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-500 ease-out will-change-transform"></span>
                  </Link>
                </>
              )}
              {user && (
                <Link to="/dashboard/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-500/10 transition">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow ${user.avatarColor||'bg-gray-400'}`}>{user.name.charAt(0)}</div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium leading-none line-clamp-1">{user.name}</p>
                    <p className="text-emerald-300 text-xs">Lihat Profil</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
