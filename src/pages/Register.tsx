import { useState, useRef } from 'react';
import { 
  Mail, Lock, Loader2, ArrowLeft, User as UserIcon, Building2, Briefcase,
  Eye, EyeOff, AlertCircle, Upload, CreditCard, CheckCircle2, Shield, Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'candidate' | 'company' | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [npwp, setNpwp] = useState('');
  const [nib, setNib] = useState('');
  const [nik, setNik] = useState('');
  
  const [ktpUploaded, setKtpUploaded] = useState(false);
  const [npwpDoc, setNpwpDoc] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 20 });
  const sy = useSpring(my, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mx.set(x / 20);
    my.set(y / 20);
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
  };

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    
    // Validasi email
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid');
      return;
    }
    
    // Validasi password
    if (!password) {
      setPasswordError('Password tidak boleh kosong');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      return;
    }
    
    // Validasi konfirmasi password
    if (!confirm) {
      setConfirmError('Konfirmasi password tidak boleh kosong');
      return;
    }
    
    if (password !== confirm) {
      setConfirmError('Password dan konfirmasi tidak sama');
      return;
    }
    
    // Lanjut ke step 3
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi nama lengkap
    if (!name.trim()) {
      alert('Nama lengkap tidak boleh kosong');
      return;
    }
    
    if (name.trim().length < 3) {
      alert('Nama lengkap minimal 3 karakter');
      return;
    }
    
    // Validasi phone (opsional tapi jika diisi harus valid)
    if (phone && phone.length < 10) {
      alert('Nomor telepon tidak valid');
      return;
    }
    
    setLoading(true);
    
    // Simulasi registrasi
    setTimeout(() => {
      setLoading(false);
      // Simpan data user ke localStorage (untuk demo)
      const userData = {
        email,
        name,
        phone,
        role,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('simhire_registered_user', JSON.stringify(userData));
      
      // Redirect berdasarkan role
      navigate(role === 'company' ? '/company' : '/dashboard');
    }, 1500);
  };

  const strengthColor = (s: number) => {
    if (s <= 1) return 'bg-red-500';
    if (s === 2) return 'bg-yellow-400';
    if (s === 3) return 'bg-green-500';
    return 'bg-primary-500';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ x: sx, y: sy }} className="absolute -top-10 -left-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <motion.div style={{ x: sx, y: sy }} className="absolute -bottom-10 -right-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-bounce" />
      </div>

      <motion.div className="w-full max-w-2xl relative z-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>

        <div className="bg-gray-900/70 backdrop-blur-xl rounded-card shadow-2xl border border-white/10 p-8">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary-500' : 'bg-gray-700'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Role Selection */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Pilih Jenis Akun</h1>
                  <p className="text-gray-400">Daftar sebagai perusahaan atau pencari kerja</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => { setRole('candidate'); setStep(2); }}
                    className="group bg-primary-500/10 hover:bg-primary-500/20 border-2 border-primary-500/30 hover:border-primary-500 rounded-xl p-8 text-left transition-all"
                  >
                    <Briefcase className="w-12 h-12 mb-4 text-primary-500" />
                    <h3 className="text-xl font-bold mb-2">Pencari Kerja</h3>
                    <p className="text-gray-400 text-sm">Cari lowongan, ikuti simulasi, dan bangun portofolio</p>
                  </button>
                  <button
                    onClick={() => { setRole('company'); setStep(2); }}
                    className="group bg-accent-blue/10 hover:bg-accent-blue/20 border-2 border-accent-blue/30 hover:border-accent-blue rounded-xl p-8 text-left transition-all"
                  >
                    <Building2 className="w-12 h-12 mb-4 text-accent-blue" />
                    <h3 className="text-xl font-bold mb-2">Perusahaan</h3>
                    <p className="text-gray-400 text-sm">Post lowongan, cari talent, kelola rekrutmen</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Basic Info */}
            {step === 2 && role && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className={`mx-auto w-14 h-14 rounded-xl ${role === 'company' ? 'bg-accent-blue' : 'bg-primary-500'} flex items-center justify-center mb-4`}>
                    {role === 'company' ? <Building2 className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
                  </div>
                  <h1 className="text-2xl font-bold">Informasi Dasar</h1>
                  <p className="text-gray-400">Lengkapi data diri Anda</p>
                </div>
                <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
                  {role === 'company' && (
                    <div>
                      <label className="block text-sm mb-1">Nama Perusahaan *</label>
                      <input type="text" required className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 focus:border-accent-blue outline-none"
                        placeholder="PT. Teknologi Indonesia" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm mb-1">{role === 'company' ? 'Nama Perwakilan *' : 'Nama Lengkap *'}</label>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" required className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 focus:border-primary-500 outline-none"
                        placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="email" required className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800/80 border ${emailError ? 'border-red-500' : 'border-white/10'} outline-none`}
                          placeholder="email@domain.com" value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} />
                      </div>
                      {emailError && <div className="text-red-400 text-xs mt-1">{emailError}</div>}
                    </div>
                    <div>
                      <label className="block text-sm mb-1">No. Telepon *</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="tel" required className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 outline-none"
                          placeholder="08123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Password *</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type={showPassword ? 'text' : 'password'} required className="w-full pl-10 pr-11 py-3 rounded-lg bg-gray-800/80 border border-white/10 outline-none"
                          placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); calcPasswordStrength(e.target.value); }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0,1,2,3].map((i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded ${i < passwordStrength ? strengthColor(passwordStrength) : 'bg-white/10'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Konfirmasi Password *</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type={showConfirm ? 'text' : 'password'} required className={`w-full pl-10 pr-11 py-3 rounded-lg bg-gray-800/80 border ${confirmError ? 'border-red-500' : 'border-white/10'} outline-none`}
                          placeholder="••••••••" value={confirm} onChange={(e) => { setConfirm(e.target.value); setConfirmError(null); }} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {confirmError && <div className="text-red-400 text-xs mt-1">{confirmError}</div>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/30">Kembali</button>
                    <button type="submit" className={`flex-1 ${role === 'company' ? 'bg-accent-blue' : 'bg-primary-500'} py-3 rounded-lg font-semibold`}>
                      Lanjut ke Verifikasi
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Verification */}
            {step === 3 && role && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="mx-auto w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h1 className="text-2xl font-bold">Verifikasi Akun</h1>
                  <p className="text-gray-400">{role === 'company' ? 'Upload dokumen perusahaan' : 'Verifikasi identitas'}</p>
                </div>
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  {role === 'company' ? (
                    <>
                      <div>
                        <label className="block text-sm mb-1">NPWP Perusahaan *</label>
                        <div className="relative">
                          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="text" required className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 outline-none"
                            placeholder="00.000.000.0-000.000" value={npwp} onChange={(e) => setNpwp(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">NIB (Nomor Induk Berusaha) *</label>
                        <input type="text" required className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 outline-none"
                          placeholder="0000000000000" value={nib} onChange={(e) => setNib(e.target.value)} />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Dokumen Pendukung *</p>
                        <label className={`block border-2 border-dashed ${npwpDoc ? 'border-green-500 bg-green-500/10' : 'border-gray-600'} rounded-lg p-4 cursor-pointer`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Upload className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">Dokumen NPWP</p>
                                <p className="text-xs text-gray-400">PDF, max 2MB</p>
                              </div>
                            </div>
                            {npwpDoc ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                              <input type="file" className="hidden" onChange={() => setNpwpDoc(true)} accept=".pdf" />
                            }
                          </div>
                        </label>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold mb-1">Verifikasi Manual</p>
                            <p className="text-xs text-gray-400">Dokumen akan diverifikasi tim kami dalam 1-2 hari kerja</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm mb-1">NIK (Nomor Induk Kependudukan) *</label>
                        <div className="relative">
                          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="text" required maxLength={16} className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800/80 border border-white/10 outline-none"
                            placeholder="16 digit NIK" value={nik} onChange={(e) => setNik(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className={`block border-2 border-dashed ${ktpUploaded ? 'border-green-500 bg-green-500/10' : 'border-gray-600'} rounded-lg p-4 cursor-pointer`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Upload className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">Foto KTP</p>
                                <p className="text-xs text-gray-400">JPG/PNG, max 2MB</p>
                              </div>
                            </div>
                            {ktpUploaded ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                              <input type="file" className="hidden" onChange={() => setKtpUploaded(true)} accept="image/*" />
                            }
                          </div>
                        </label>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold mb-1">Verifikasi Cepat</p>
                            <p className="text-xs text-gray-400">Verifikasi email otomatis setelah pendaftaran</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/30">Kembali</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-400 mt-6">
            Sudah punya akun? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Masuk</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
