import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Briefcase, MapPin, DollarSign, FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { saveApplication, type Application } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
    id?: string;
    title: string;
    company: string;
    location?: string;
    salary?: string;
    type?: string;
    companyLogo?: string;
  };
  onApplicationSubmitted?: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ isOpen, onClose, jobData, onApplicationSubmitted }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cv: null as File | null,
    coverLetter: '',
    portfolio: '',
    agreeTerms: false
  });
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Load saved draft from localStorage
  useEffect(() => {
    if (isOpen && jobData.id) {
      const savedDraft = localStorage.getItem(`cover_letter_draft_${jobData.id}`);
      if (savedDraft) {
        setFormData(prev => ({ ...prev, coverLetter: savedDraft }));
      }
    }
  }, [isOpen, jobData.id]);
  
  // Auto-save draft every 3 seconds
  useEffect(() => {
    if (formData.coverLetter && jobData.id && step === 2) {
      const timer = setTimeout(() => {
        localStorage.setItem(`cover_letter_draft_${jobData.id}`, formData.coverLetter);
        toast.success('Draft tersimpan otomatis', { duration: 1000 });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formData.coverLetter, jobData.id, step]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cv: e.target.files![0] }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Load simulasi scores dari localStorage
    const simulasiResults = JSON.parse(localStorage.getItem('simhire_simulasi_results') || '[]');
    const userSimulasiScores: Record<string, number> = {};
    
    // Aggregate scores by category
    simulasiResults.forEach((result: any) => {
      if (result.score) {
        userSimulasiScores[result.categoryId || result.title] = result.score;
      }
    });
    
    // Create application object with simulasi scores
    const application: Application = {
      id: crypto.randomUUID(),
      jobId: jobData.id || crypto.randomUUID(),
      jobTitle: jobData.title,
      company: jobData.company,
      companyLogo: jobData.companyLogo,
      location: jobData.location || 'Remote',
      salary: jobData.salary,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      notes: formData.coverLetter,
      simulasiScores: Object.keys(userSimulasiScores).length > 0 ? userSimulasiScores : undefined,
      timeline: [
        {
          date: new Date().toISOString(),
          status: 'applied',
          description: 'Application submitted successfully',
        },
      ],
    };
    
    // Save to localStorage
    const saved = saveApplication(application);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (saved) {
        setStep(3);
        toast.success('Lamaran berhasil dikirim!', {
          description: `Lamaran Anda untuk posisi ${jobData.title} di ${jobData.company} telah dikirim`,
          icon: '🎉',
          action: {
            label: 'Lihat Status',
            onClick: () => {
              handleClose();
              navigate('/dashboard/application-tracker');
            },
          },
        });
        
        if (onApplicationSubmitted) {
          onApplicationSubmitted();
        }
      } else {
        toast.error('Gagal mengirim lamaran', {
          description: 'Terjadi kesalahan saat menyimpan data',
        });
      }
    }, 1500);
  };

  const handleClose = () => {
    // Hapus draft setelah submit sukses
    if (step === 3 && jobData.id) {
      localStorage.removeItem(`cover_letter_draft_${jobData.id}`);
    }
    setStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      cv: null,
      coverLetter: '',
      portfolio: '',
      agreeTerms: false
    });
    setShowTemplates(false);
    onClose();
  };
  
  // Cover letter templates
  const getCoverLetterTemplate = (jobTitle: string) => {
    const templates = {
      default: `Kepada Yth. Tim Rekrutmen ${jobData.company},

Saya sangat tertarik untuk melamar posisi ${jobTitle} di ${jobData.company}. Dengan latar belakang pengalaman saya di bidang terkait, saya yakin dapat memberikan kontribusi positif bagi tim Anda.

Saya memiliki pengalaman dalam [sebutkan pengalaman relevan] dan menguasai [sebutkan skills]. Saya sangat antusias untuk dapat bergabung dengan tim ${jobData.company} dan berkontribusi mencapai tujuan perusahaan.

Terima kasih atas waktu dan pertimbangan Anda. Saya berharap dapat berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi di ${jobData.company}.

Hormat saya,
${formData.fullName || '[Nama Anda]'}`,
      
      developer: `Kepada Yth. Tim Rekrutmen ${jobData.company},

Saya menulis surat ini untuk melamar posisi ${jobTitle}. Sebagai developer dengan pengalaman [X] tahun, saya telah mengerjakan berbagai proyek yang melibatkan teknologi modern dan best practices.

Keahlian teknis saya meliputi:
• Pengembangan aplikasi menggunakan [teknologi]
• Problem solving dan debugging yang efisien
• Kolaborasi dalam tim agile/scrum

Saya tertarik dengan ${jobData.company} karena reputasinya dalam inovasi teknologi. Portfolio saya dapat dilihat di ${formData.portfolio || '[Link Portfolio]'}.

Saya berharap dapat mendiskusikan bagaimana skills saya dapat membantu mencapai goals tim Anda.

Best regards,
${formData.fullName || '[Nama Anda]'}`,

      designer: `Dear Hiring Team at ${jobData.company},

I am excited to apply for the ${jobTitle} position. As a designer passionate about creating meaningful user experiences, I believe I would be a great fit for your team.

My design philosophy centers around:
• User-centered design thinking
• Clean, functional aesthetics
• Collaboration with developers and stakeholders

I admire ${jobData.company}'s commitment to excellent design and would love to contribute to your creative projects.

Thank you for considering my application. I look forward to discussing how my design skills can add value to your team.

Warm regards,
${formData.fullName || '[Your Name]'}`,

      marketing: `Kepada Tim HR ${jobData.company},

Saya dengan antusias melamar posisi ${jobTitle}. Dengan pengalaman di digital marketing dan content strategy, saya siap membantu ${jobData.company} mencapai target growth.

Pencapaian saya meliputi:
• Meningkatkan engagement [X]% melalui kampanye kreatif
• Mengelola budget advertising dengan ROI optimal
• Menganalisis data untuk strategi berbasis insight

Saya terkesan dengan strategi marketing ${jobData.company} dan ingin berkontribusi dengan ide-ide fresh dan data-driven approach.

Terima kasih atas kesempatan ini.

Salam,
${formData.fullName || '[Nama Anda]'}`
    };
    
    const jobLower = jobTitle.toLowerCase();
    if (jobLower.includes('developer') || jobLower.includes('programmer') || jobLower.includes('engineer')) {
      return templates.developer;
    } else if (jobLower.includes('design') || jobLower.includes('ui') || jobLower.includes('ux')) {
      return templates.designer;
    } else if (jobLower.includes('marketing') || jobLower.includes('social media')) {
      return templates.marketing;
    }
    return templates.default;
  };
  
  const useTemplate = () => {
    const template = getCoverLetterTemplate(jobData.title);
    setFormData(prev => ({ ...prev, coverLetter: template }));
    setShowTemplates(false);
    toast.success('Template diterapkan! Silakan personalisasi sesuai kebutuhan.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Lamar Pekerjaan</DialogTitle>
              <DialogDescription>
                Pastikan data Anda lengkap untuk meningkatkan peluang diterima
              </DialogDescription>
            </DialogHeader>

            {/* Job Info */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900 text-lg">{jobData.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{jobData.company}</span>
                </div>
                {jobData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{jobData.location}</span>
                  </div>
                )}
                {jobData.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{jobData.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">No. Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cv">Upload CV/Resume *</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('cv')?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.cv ? formData.cv.name : 'Pilih File'}
                  </Button>
                  {formData.cv && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div>
                <Label htmlFor="portfolio">Portfolio/LinkedIn (Opsional)</Label>
                <Input
                  id="portfolio"
                  placeholder="https://..."
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email || !formData.phone || !formData.cv}
              >
                Lanjutkan
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Tambahkan Cover Letter</DialogTitle>
              <DialogDescription>
                Ceritakan mengapa Anda cocok untuk posisi ini
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Template Button */}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-xs"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {showTemplates ? 'Tutup Template' : 'Gunakan Template'}
                </Button>
                {formData.coverLetter && (
                  <span className="text-xs text-gray-500">
                    Draft tersimpan otomatis
                  </span>
                )}
              </div>

              {/* Template Preview */}
              {showTemplates && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">✨ Template Cover Letter</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Kami telah menyiapkan template yang disesuaikan dengan posisi <span className="font-semibold">{jobData.title}</span>
                  </p>
                  <Button
                    type="button"
                    onClick={useTemplate}
                    size="sm"
                    className="w-full"
                  >
                    Gunakan Template Ini
                  </Button>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <span className={`text-xs ${
                    formData.coverLetter.length < 100 ? 'text-red-600' :
                    formData.coverLetter.length < 200 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {formData.coverLetter.length} / 500 karakter
                    {formData.coverLetter.length < 100 && ' (minimal 100)'}
                  </span>
                </div>
                <Textarea
                  id="coverLetter"
                  placeholder="Contoh:

Kepada Yth. Tim Rekrutmen [Perusahaan],

Saya sangat tertarik untuk melamar posisi ini karena...

Pengalaman saya meliputi:
• [Pengalaman 1]
• [Pengalaman 2]

Saya yakin dapat berkontribusi...

Hormat saya,
[Nama Anda]"
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value.slice(0, 500))}
                  rows={12}
                  className="mt-1 resize-none font-mono text-sm"
                />
                
                {/* Character Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        formData.coverLetter.length < 100 ? 'bg-red-500' :
                        formData.coverLetter.length < 200 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((formData.coverLetter.length / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1 text-sm">💡 Tips Cover Letter yang Menarik</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✅ Jelaskan MENGAPA Anda tertarik dengan posisi & perusahaan ini</li>
                      <li>✅ Sebutkan 2-3 keahlian/pengalaman yang RELEVAN dengan job description</li>
                      <li>✅ Tunjukkan antusiasme dan motivasi Anda dengan contoh konkret</li>
                      <li>✅ Gunakan bahasa profesional tapi tetap personal</li>
                      <li>❌ Hindari copy-paste dari CV atau template generik</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  Saya menyetujui bahwa data yang saya berikan adalah benar dan dapat digunakan oleh perusahaan untuk proses rekrutmen
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Kembali
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={formData.coverLetter.length < 100 || !formData.agreeTerms || isSubmitting}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Mengirim...' : `Kirim Lamaran ${formData.coverLetter.length >= 100 ? '✓' : ''}`}
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Lamaran Terkirim!
              </h3>
              <p className="text-gray-600 mb-6">
                Lamaran Anda untuk posisi <span className="font-semibold">{jobData.title}</span> di <span className="font-semibold">{jobData.company}</span> telah berhasil dikirim.
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Langkah Selanjutnya:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">1.</span>
                    <span>Perusahaan akan meninjau lamaran Anda dalam 3-5 hari kerja</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">2.</span>
                    <span>Anda akan menerima notifikasi melalui email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">3.</span>
                    <span>Pantau status lamaran di halaman Application Tracker</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleClose} variant="outline" className="flex-1">
                  Kembali ke Pencarian
                </Button>
                <Button 
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard/application-tracker');
                  }} 
                  className="flex-1"
                >
                  Lihat Status Lamaran
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
