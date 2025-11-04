import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  ExternalLink
} from 'lucide-react';
import { getJobApplications, getJobPosts, updateApplicationStage } from '@/lib/company/data';
import { JobApplication, ApplicationStage, JobPost } from '@/lib/company/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { handleError } from '@/lib/errors';

const CompanyApplicants: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedStage, setSelectedStage] = useState<ApplicationStage | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stages: { key: ApplicationStage | 'all'; label: string; color: string }[] = [
    { key: 'all', label: 'Semua', color: 'bg-gray-100 text-gray-800' },
    { key: 'applied', label: 'Melamar', color: 'bg-blue-100 text-blue-800' },
    { key: 'screening', label: 'Screening', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
    { key: 'offer', label: 'Penawaran', color: 'bg-green-100 text-green-800' },
    { key: 'hired', label: 'Diterima', color: 'bg-primary-100 text-primary-800' },
    { key: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [selectedStage, selectedJob, searchQuery]);

  const loadData = () => {
    const allApplications = getJobApplications();
    const allJobs = getJobPosts();
    setJobs(allJobs);
    setApplications(allApplications);
  };

  const filterApplications = useCallback(() => {
    let filtered = getJobApplications();

    // Filter by stage
    if (selectedStage !== 'all') {
      filtered = filtered.filter(app => app.stage === selectedStage);
    }

    // Filter by job
    if (selectedJob !== 'all') {
      filtered = filtered.filter(app => app.jobId === selectedJob);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(query) ||
        app.candidateEmail?.toLowerCase().includes(query) ||
        app.candidateSkills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    setApplications(filtered);
  }, [selectedStage, selectedJob, searchQuery]);

  const handleStageChange = (applicationId: string, newStage: ApplicationStage) => {
    try {
      updateApplicationStage(applicationId, newStage, `Stage diubah ke ${stages.find(s => s.key === newStage)?.label}`);
      filterApplications();
      toast.success(`Status pelamar berhasil diubah ke ${stages.find(s => s.key === newStage)?.label}`);
    } catch (error) {
      handleError(error, 'handleStageChange');
      toast.error('Gagal mengubah status pelamar');
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobs.find(job => job.id === jobId)?.title || 'Unknown Job';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStageColor = (stage: ApplicationStage) => {
    return stages.find(s => s.key === stage)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStageLabel = (stage: ApplicationStage) => {
    return stages.find(s => s.key === stage)?.label || stage;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pipeline Pelamar</h1>
        <p className="text-gray-600">Kelola semua pelamar di seluruh lowongan</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama atau skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as ApplicationStage | 'all')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
            >
              {stages.map(stage => (
                <option key={stage.key} value={stage.key}>{stage.label}</option>
              ))}
            </select>

            {/* Job Filter */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-blue"
            >
              <option value="all">Semua Lowongan</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stage Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.filter(s => s.key !== 'all').map(stage => {
          const count = getJobApplications().filter(app => app.stage === stage.key).length;
          return (
            <Card key={stage.key} className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${stage.color}`}>
                  {stage.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">�</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || selectedStage !== 'all' || selectedJob !== 'all'
                  ? 'Tidak ada pelamar yang cocok'
                  : 'Belum ada pelamar'
                }
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedStage !== 'all' || selectedJob !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Pelamar akan muncul setelah ada yang mendaftar ke lowongan Anda'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Candidate Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{application.candidateName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{getJobTitle(application.jobId)}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          {application.candidateEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{application.candidateEmail}</span>
                            </div>
                          )}
                          {application.candidateLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{application.candidateLocation}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Melamar {formatDate(application.appliedAt)}</span>
                          </div>
                          {application.scoreOverall && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span>Skor: {application.scoreOverall}/10</span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {application.candidateSkills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.candidateSkills.length > 4 && (
                            <Badge variant="secondary" className="text-xs text-gray-500">
                              +{application.candidateSkills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                        <Badge className={`${getStageColor(application.stage)}`}>
                          {getStageLabel(application.stage)}
                        </Badge>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Ubah Status</label>
                        <select
                          value={application.stage}
                          onChange={(e) => handleStageChange(application.id, e.target.value as ApplicationStage)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-blue"
                        >
                          {stages.filter(s => s.key !== 'all').map(stage => (
                            <option key={stage.key} value={stage.key}>{stage.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Actions */}
                  <div>
                    <div className="space-y-3">
                      {/* Notes Preview */}
                      {application.reviewerNotes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Catatan Terbaru</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {application.reviewerNotes[application.reviewerNotes.length - 1]}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/company/applicants/${application.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Lihat Detail
                          </Link>
                        </Button>
                        
                        {application.stage === 'interview' && (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleStageChange(application.id, 'offer')}
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Buat Penawaran
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyApplicants;
