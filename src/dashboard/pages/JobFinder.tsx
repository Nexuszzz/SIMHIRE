import { useState, useMemo, useEffect } from 'react';
import { Search, Users, MapPin, Building2, Bookmark, TrendingUp, Star, Clock, Briefcase, DollarSign, Target, Zap, Award, Grid3x3, List, BookmarkCheck, Share2 } from 'lucide-react';
import { MOCK_JOBS, type Job } from '../../lib/jobsData';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ApplyJobModal from '../components/modals/ApplyJobModal';
import { loadSavedJobs, toggleSaveJob as toggleSaveJobStorage, hasAppliedToJob, type SavedJob } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

type ViewMode = 'grid' | 'list';

const JobFinder: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    workSchedule: [] as string[],
    experienceLevel: [] as string[],
    workStyle: [] as string[],
    salaryRange: [0, 50] as [number, number],
    remote: null as boolean | null,
    location: '',
    skills: [] as string[]
  });

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = loadSavedJobs();
    setSavedJobs(new Set(saved.map(j => j.jobId)));
  }, []);

  // Toggle save job
  const toggleSaveJob = (job: Job) => {
    const savedJob: SavedJob = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: `Rp ${job.salary.min / 1000000}jt - ${job.salary.max / 1000000}jt`,
      type: job.type,
      savedAt: new Date().toISOString(),
    };
    
    const wasAdded = toggleSaveJobStorage(savedJob);
    
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (wasAdded) {
        newSet.add(job.id);
        toast.success(`"${job.title}" disimpan ke bookmark`, {
          icon: '⭐',
          action: {
            label: 'Lihat',
            onClick: () => navigate('/dashboard/application-tracker?tab=saved'),
          },
        });
      } else {
        newSet.delete(job.id);
        toast.success(`"${job.title}" dihapus dari bookmark`, {
          icon: '🔖'
        });
      }
      return newSet;
    });
  };

  // Handle apply
  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    let jobs = MOCK_JOBS.filter((job: Job) => {
      // Search term filter
      if (debouncedSearchTerm) {
        const searchTermLower = debouncedSearchTerm.toLowerCase();
        const matches = 
          job.title.toLowerCase().includes(searchTermLower) ||
          job.company.toLowerCase().includes(searchTermLower) ||
          job.location.toLowerCase().includes(searchTermLower) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTermLower));
        
        if (!matches) return false;
      }

      // Work schedule filter
      if (filters.workSchedule.length > 0 && !filters.workSchedule.includes(job.type)) {
        return false;
      }

      // Experience level filter
      if (filters.experienceLevel.length > 0 && !filters.experienceLevel.includes(job.experienceLevel)) {
        return false;
      }

      // Work style filter
      if (filters.workStyle.length > 0) {
        const jobWorkStyle = job.remote ? 'remote' : 'on-site';
        if (!filters.workStyle.includes(jobWorkStyle)) {
          return false;
        }
      }

      // Salary range filter (convert to millions for comparison)
      const salaryInMillions = job.salary.max / 1000000;
      if (salaryInMillions < filters.salaryRange[0] || salaryInMillions > filters.salaryRange[1]) {
        return false;
      }

      // Location filter
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some(filterSkill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(filterSkill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      return true;
    });

    // Sort jobs
    if (sortBy === 'newest') {
      jobs = jobs.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    } else if (sortBy === 'salary') {
      jobs = jobs.sort((a, b) => b.salary.max - a.salary.max);
    } else if (sortBy === 'company') {
      jobs = jobs.sort((a, b) => a.company.localeCompare(b.company));
    }

    return jobs;
  }, [debouncedSearchTerm, filters, sortBy]);

  // Get company logo placeholder
  const getCompanyLogo = (company: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-primary-500 to-primary-600', 'from-orange-500 to-orange-600'];
    const index = company.length % colors.length;
    return colors[index];
  };

  const stats = [
    { label: 'Total Lowongan', value: MOCK_JOBS.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Lowongan Baru', value: '24+', icon: Zap, color: 'bg-primary-500' },
    { label: 'Perusahaan', value: '150+', icon: Building2, color: 'bg-purple-500' },
    { label: 'Match Rate', value: '85%', icon: Target, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={setFilters}
        jobCount={filteredJobs.length}
      />
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header with Stats */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pencari Pekerjaan</h1>
              <p className="text-gray-600">Temukan lowongan pekerjaan yang sesuai dengan keahlian dan minat Anda</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={(query) => setSearchTerm(query)}
            activeFilters={[...filters.workSchedule, ...filters.experienceLevel, ...filters.workStyle]}
            onAddFilter={() => {/* Filter handling */}}
            onRemoveFilter={() => {/* Filter handling */}}
          />

          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredJobs.length} Lowongan Ditemukan
              </h2>
              {filteredJobs.length > 0 && (
                <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
                  Tersedia
                </span>
              )}
              {savedJobs.size > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  {savedJobs.size} Disimpan
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="relevant">Paling Relevan</option>
                <option value="newest">Terbaru</option>
                <option value="salary">Gaji Tertinggi</option>
                <option value="company">Perusahaan A-Z</option>
              </select>
            </div>
          </div>

          {/* Job Results Grid */}
          <div className="grid gap-4">
            {filteredJobs.map((job: Job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-primary-300 transition-all group"
              >
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCompanyLogo(job.company)} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                    {job.company.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {job.title}
                          </h3>
                          {index < 3 && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          {job.remote && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleSaveJob(job)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg transition-all ${
                          savedJobs.has(job.id)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        title={savedJobs.has(job.id) ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-5 h-5 fill-current" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills & Info Bar */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Gaji</p>
                            <p className="font-semibold text-gray-900">
                              Rp {(job.salary.min / 1000000).toFixed(0)} - {(job.salary.max / 1000000).toFixed(0)}jt
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pelamar</p>
                            <p className="font-semibold text-gray-900">{job.applicationCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-orange-100 rounded-lg">
                            <Clock className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Diposting</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(job.posted).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                          job.type === 'full-time' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {job.type === 'full-time' ? 'Penuh Waktu' : job.type === 'part-time' ? 'Paruh Waktu' : job.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApply(job)}
                            disabled={hasAppliedToJob(job.id)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                              hasAppliedToJob(job.id)
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-lg'
                            }`}
                          >
                            {hasAppliedToJob(job.id) ? 'Sudah Dilamar' : 'Lamar Sekarang'}
                            <Award className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              navigator.clipboard.writeText(`${job.title} di ${job.company}`);
                              toast.success('Link pekerjaan berhasil disalin!', { icon: '📋' });
                            }}
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all"
                            title="Bagikan pekerjaan"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada lowongan ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    workSchedule: [],
                    experienceLevel: [],
                    workStyle: [],
                    salaryRange: [0, 50],
                    remote: null,
                    location: '',
                    skills: []
                  });
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Reset Filter
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Apply Job Modal */}
      {selectedJob && (
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
          jobData={{
            id: selectedJob.id,
            title: selectedJob.title,
            company: selectedJob.company,
            location: selectedJob.location,
            salary: `Rp ${selectedJob.salary.min / 1000000}jt - ${selectedJob.salary.max / 1000000}jt`,
            type: selectedJob.type,
            companyLogo: getCompanyLogo(selectedJob.company)
          }}
          onApplicationSubmitted={() => {
            // Refresh to show "Sudah Dilamar"
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default JobFinder;
