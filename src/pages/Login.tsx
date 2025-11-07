import { useRef, useState } from 'react';
import { Mail, Lock, Loader2, ArrowLeft, Linkedin, AtSign, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUser } from '@/context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4
  const [passwordHint, setPasswordHint] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { mockLogin, mockCompanyLogin } = useUser();
  
  // Get return URL from location state
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl || '/dashboard';

  // Parallax motion values
  const containerRef = useRef<HTMLDivElement | null>(null);
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const sx1 = useSpring(x1, { stiffness: 60, damping: 20 });
  const sy1 = useSpring(y1, { stiffness: 60, damping: 20 });
  const sx2 = useSpring(x2, { stiffness: 60, damping: 20 });
  const sy2 = useSpring(y2, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x1.set(relX / 40);
    y1.set(relY / 40);
    x2.set(-relX / 60);
    y2.set(-relY / 60);
  };
  const handleMouseLeave = () => {
    x1.set(0); y1.set(0); x2.set(0); y2.set(0);
  };

  const validateEmail = (val: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setEmailError(val && !ok ? 'Format email tidak valid' : null);
  };

  const calcPasswordStrength = (val: string) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Za-z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setPasswordStrength(s);
    const labels = ['Sangat lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat kuat'];
    setPasswordHint(labels[s]);
  };

  // Dummy accounts untuk demo
  const DEMO_ACCOUNTS = {
    candidate: {
      email: 'kandidat@wengdev.com',
      password: 'kandidat123',
      role: 'candidate'
    },
    company: {
      email: 'perusahaan@wengdev.com',
      password: 'perusahaan123',
      role: 'company'
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validasi input tidak kosong
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong');
      return;
    }
    
    if (!password) {
      setPasswordError('Password tidak boleh kosong');
      return;
    }
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid');
      return;
    }
    
    setLoading(true);
    
    // Simulasi API call dengan validasi credentials
    setTimeout(() => {
      // Check kandidat account
      if (email === DEMO_ACCOUNTS.candidate.email && password === DEMO_ACCOUNTS.candidate.password) {
        mockLogin();
        // Use returnUrl if it's for candidate, otherwise default to /dashboard
        navigate(returnUrl.startsWith('/dashboard') ? returnUrl : '/dashboard');
      }
      // Check company account
      else if (email === DEMO_ACCOUNTS.company.email && password === DEMO_ACCOUNTS.company.password) {
        mockCompanyLogin();
        // Company always goes to /company
        navigate('/company');
      }
      // Invalid credentials
      else {
        setEmailError('Email atau password salah');
        setPasswordError('Silakan periksa kembali email dan password Anda');
        setLoading(false);
      }
    }, 1200);
  };

  const socialLogin = async (provider: 'google' | 'linkedin') => {
    setLoading(true);
    // Arahkan ke halaman OAuth tiruan, menyertakan 'state' agar setelah callback bisa kembali ke tujuan
    const state = '/dashboard';
    navigate(`/auth/${provider}?state=${encodeURIComponent(state)}`);
  };

  const strengthColor = (s: number) => {
    if (s <= 1) return 'bg-red-500';
    if (s === 2) return 'bg-yellow-400';
    if (s === 3) return 'bg-green-500';
    return 'bg-primary-500';
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white flex items-center justify-center p-4 sm:p-6 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ x: sx1, y: sy1 }} className="absolute -top-10 -left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <motion.div style={{ x: sx2, y: sy2 }} className="absolute -bottom-10 -right-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-bounce" />
      </div>

      <motion.div className="w-full max-w-md relative" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Link to="/" className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>

        <div className="bg-gray-900/70 backdrop-blur-xl rounded-card shadow-2xl border border-white/10 p-6 sm:p-8 hover:shadow-primary-500/10 transition-shadow">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg mb-4 animate-pulse">
              <AtSign className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Masuk ke Akun</h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">Akses dashboard dan kelola aktivitas Anda</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base rounded-input bg-gray-800/80 border ${emailError ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-primary-500'} outline-none transition-all`}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              {emailError ? (
                <div id="email-error" className="flex items-center text-red-400 text-xs mt-1 gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {emailError}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-9 sm:pl-10 pr-11 py-2.5 sm:py-3 text-sm sm:text-base rounded-input bg-gray-800/80 border border-white/10 focus:border-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); calcPasswordStrength(e.target.value); }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className={`h-1 sm:h-1.5 flex-1 rounded ${i < passwordStrength ? strengthColor(passwordStrength) : 'bg-white/10'}`}></div>
                  ))}
                </div>
                <div className="text-xs text-gray-400">{password ? passwordHint : 'Gunakan min. 8 karakter, kombinasikan huruf, angka, dan simbol.'}</div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 py-2.5 sm:py-3 text-sm sm:text-base rounded-button font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : null}
              {loading ? 'Memproses...' : 'Masuk'}
            </motion.button>
          </form>

          <div className="my-4 sm:my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button onClick={() => socialLogin('google')} disabled={loading} whileTap={{ scale: 0.98 }} whileHover={{ y: -1 }} className="flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-all">
              <img alt="Google" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Google</span>
            </motion.button>
            <motion.button onClick={() => socialLogin('linkedin')} disabled={loading} whileTap={{ scale: 0.98 }} whileHover={{ y: -1 }} className="flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>LinkedIn</span>
            </motion.button>
          </div>

          <div className="my-4 sm:my-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium mb-1">Aplikasi Demo</p>
                <p className="text-xs text-gray-400">Kredensial akun demo tersedia di README repository GitHub.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Daftar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
