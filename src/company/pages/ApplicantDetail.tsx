import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Star, Download, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getApplication, updateApplicationStage, addApplicationNote } from '@/lib/company/data';
import { JobApplication, ApplicationStage } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const stageLabels: Record<ApplicationStage, string> = {
  'applied': 'Melamar',
  'screening': 'Screening',
  'interview': 'Interview',
  'offer': 'Penawaran',
  'hired': 'Diterima',
  'rejected': 'Ditolak'
};

const stageColors: Record<ApplicationStage, string> = {
  'applied': 'bg-blue-100 text-blue-800',
  'screening': 'bg-yellow-100 text-yellow-800',
  'interview': 'bg-purple-100 text-purple-800',
  'offer': 'bg-green-100 text-green-800',
  'hired': 'bg-primary-100 text-primary-800',
  'rejected': 'bg-red-100 text-red-800'
};

const ApplicantDetail: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const loadApplication = () => {
      if (!applicationId) return;

      try {
        const app = getApplication(applicationId);
        if (!app) {
          toast.error('Aplikasi tidak ditemukan');
          navigate('/company/applicants');
          return;
        }
        setApplication(app);
      } catch (error) {
        console.error('Error loading application:', error);
        toast.error('Gagal memuat data aplikasi');
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId, navigate]);

  const handleStageChange = (newStage: ApplicationStage) => {
    if (!applicationId) return;

    try {
      updateApplicationStage(applicationId, newStage);
      setApplication(prev => prev ? { ...prev, stage: newStage } : null);
      toast.success(`Status berhasil diubah ke ${stageLabels[newStage]}`);
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleAddNote = async () => {
    if (!applicationId || !noteText.trim()) return;

    setAddingNote(true);
    try {
      const note = {
        id: Date.now().toString(),
        content: noteText.trim(),
        createdAt: new Date().toISOString(),
        author: 'HR Manager'
      };

      addApplicationNote(applicationId, note);
      
      setApplication(prev => prev ? {
        ...prev,
        reviewerNotes: [...prev.reviewerNotes, `[${note.author}] ${note.content}`]
      } : null);

      setNoteText('');
      toast.success('Catatan berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Gagal menambahkan catatan');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pelamar</h1>
            <p className="text-gray-600">Memuat data pelamar...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-card border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pelamar</h1>
            <p className="text-gray-600">Pelamar tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/company/applicants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.candidateName}</h1>
            <p className="text-gray-600">Melamar untuk posisi ini</p>
          </div>
        </div>
        <Badge className={stageColors[application.stage]}>
          {stageLabels[application.stage]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kandidat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.candidateEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-medium">{application.candidatePhone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-medium">{application.candidateLocation || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Skor Keseluruhan</p>
                    <p className="font-medium">{application.scoreOverall}/10</p>
                  </div>
                </div>
              </div>

              {application.candidateSkills && application.candidateSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.candidateSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Aplikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Melamar</p>
                  <p className="font-medium">{new Date(application.appliedAt).toLocaleDateString('id-ID')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ekspektasi Gaji</p>
                  <p className="font-medium">
                    {application.salaryExpectation 
                      ? `Rp ${application.salaryExpectation.toLocaleString('id-ID')}`
                      : 'Tidak disebutkan'
                    }
                  </p>
                </div>
              </div>

              {application.coverLetter && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{application.coverLetter}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">CV/Resume</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Catatan Internal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.reviewerNotes && application.reviewerNotes.length > 0 ? (
                <div className="space-y-3">
                  {application.reviewerNotes.map((note, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada catatan.</p>
              )}

              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Tambahkan catatan internal..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
                />
                <Button 
                  onClick={handleAddNote} 
                  size="sm"
                  disabled={addingNote || !noteText.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {addingNote ? 'Menambahkan...' : 'Tambah Catatan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Tindakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Stage Management */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Ubah Status</p>
                
                {application.stage !== 'screening' && application.stage !== 'hired' && application.stage !== 'rejected' && (
                  <Button
                    onClick={() => handleStageChange('screening')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pindah ke Screening
                  </Button>
                )}

                {application.stage === 'screening' && (
                  <Button
                    onClick={() => handleStageChange('interview')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Undang Interview
                  </Button>
                )}

                {application.stage === 'interview' && (
                  <Button
                    onClick={() => handleStageChange('offer')}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Buat Penawaran
                  </Button>
                )}

                {application.stage === 'offer' && (
                  <Button
                    onClick={() => handleStageChange('hired')}
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terima Kandidat
                  </Button>
                )}

                {application.stage !== 'hired' && application.stage !== 'rejected' && (
                  <Button
                    onClick={() => handleStageChange('rejected')}
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak Kandidat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                  <div>
                    <p className="font-medium">Melamar</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(application.appliedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {application.stage !== 'applied' && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Dalam Proses</p>
                      <p className="text-gray-500 text-xs">Status: {stageLabels[application.stage]}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;
