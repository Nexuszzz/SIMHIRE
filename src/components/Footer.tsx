import { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/90 to-primary-900/90"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-2xl animate-bounce"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent">
            Siap Memulai Karir Impian Anda?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Bergabung dengan ribuan kandidat yang telah berhasil mendapatkan pekerjaan melalui platform kami
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-10 py-4 rounded-button font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary-500/25 flex items-center justify-center space-x-3 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-white/15 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="group border-2 border-gray-600 text-gray-300 hover:border-primary-500 hover:text-primary-400 px-10 py-4 rounded-button font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-primary-500/10 opacity-0 -translate-x-[120%] group-hover:opacity-100 group-hover:translate-x-[120%] transition-all duration-400 ease-out will-change-transform"></div>
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          <div>
            <div className="flex items-center space-x-3 mb-6 group">
              <img 
                src="/logo.png" 
                alt="SimHire Logo" 
                className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                SimHire
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Platform kerja terdepan yang menghubungkan talenta berkualitas dengan perusahaan terbaik di Indonesia.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-400">Platform</h3>
            <ul className="space-y-3 text-gray-400">
              {['Untuk Kandidat', 'Untuk Perusahaan', 'Simulasi Gratis', 'Tryout Premium'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group"
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === item ? 'w-full' : ''}`}></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">Resources</h3>
            <ul className="space-y-3 text-gray-400">
              {['Blog', 'Career Guide', 'Success Stories', 'FAQ'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-2 inline-block relative group"
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 ${hoveredLink === item ? 'w-full' : ''}`}></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-emerald-400">Kontak</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>hello@jobhub.id</span>
              </div>
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 group hover:text-emerald-400 transition-colors duration-300">
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              &copy; 2025 SimHire. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
