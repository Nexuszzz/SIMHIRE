import { useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { Grid, List, Bookmark, Briefcase, Target, MapPin, Clock, DollarSign, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import ApplyJobModal from '../components/modals/ApplyJobModal';

// Mock data for internships
const mockInternships = [
  {
    id: '1',
    company: {
      name: 'TechCorp Indonesia',
      logo: '/api/placeholder/60/60',
      location: 'Jakarta Selatan'
    },
    position: 'Frontend Developer Intern',
    duration: '6 bulan',
    salary: 'Rp 3.500.000',
    isPaid: true,
    description: 'Bergabunglah dengan tim developer kami untuk mengembangkan aplikasi web modern menggunakan React, TypeScript, dan teknologi frontend terdepan.',
    tags: ['React', 'TypeScript', 'UI/UX', 'Fulltime'],
    postedDate: '2 hari lalu',
    isBookmarked: false
  },
  {
    id: '2',
    company: {
      name: 'MarketPro Agency',
      logo: '/api/placeholder/60/60',
      location: 'Bandung'
    },
    position: 'Digital Marketing Intern',
    duration: '4 bulan',
    salary: 'Rp 2.800.000',
    isPaid: true,
    description: 'Pelajari strategi digital marketing modern, social media management, dan campaign optimization dari tim marketing berpengalaman.',
    tags: ['Social Media', 'SEO', 'Content Marketing', 'Analytics'],
    postedDate: '1 hari lalu',
    isBookmarked: true
  },
  {
    id: '3',
    company: {
      name: 'FinanceHub',
      logo: '/api/placeholder/60/60',
      location: 'Jakarta Pusat'
    },
    position: 'Financial Analyst Intern',
    duration: '3 bulan',
    isPaid: false,
    description: 'Dapatkan pengalaman dalam analisis keuangan, pemodelan finansial, dan penelitian investasi di industri fintech terdepan.',
    tags: ['Excel', 'Financial Modeling', 'Analysis', 'Research'],
    postedDate: '3 hari lalu',
    isBookmarked: false
  },
  {
    id: '4',
    company: {
      name: 'DesignStudio Creative',
      logo: '/api/placeholder/60/60',
      location: 'Yogyakarta'
    },
    position: 'UI/UX Designer Intern',
    duration: '5 bulan',
    salary: 'Rp 3.000.000',
    isPaid: true,
    description: 'Belajar design thinking, user research, prototyping, dan visual design untuk menciptakan pengalaman pengguna yang luar biasa.',
    tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    postedDate: '1 minggu lalu',
    isBookmarked: false
  },
  {
    id: '5',
    company: {
      name: 'DataCorp Analytics',
      logo: '/api/placeholder/60/60',
      location: 'Surabaya'
    },
    position: 'Data Science Intern',
    duration: '6 bulan',
    salary: 'Rp 4.000.000',
    isPaid: true,
    description: 'Terlibat dalam proyek machine learning, data visualization, dan analisis big data untuk memberikan insights bisnis yang valuable.',
    tags: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    postedDate: '4 hari lalu',
    isBookmarked: true
  }
];

interface InternshipCardProps {
  id: string;
  company: {
    name: string;
    logo?: string;
    location: string;
  };
  position: string;
  duration: string;
  salary?: string;
  isPaid: boolean;
  description: string;
  tags: string[];
  postedDate: string;
  isBookmarked?: boolean;
  onApply: (id: string) => void;
  onBookmark: (id: string) => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  id,
  company,
  position,
  duration,
  salary,
  isPaid,
  description,
  tags,
  postedDate,
  isBookmarked = false,
  onApply,
  onBookmark,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-primary-300 transition-all group">
      {/* Header with Logo */}
      <div className="flex items-start gap-3 mb-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
          {company.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {position}
              </h3>
              <p className="text-sm text-gray-600 font-medium line-clamp-1">{company.name}</p>
            </div>
            <button
              onClick={() => onBookmark(id)}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                isBookmarked
                  ? 'text-yellow-500 bg-yellow-50'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{company.location}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {description}
      </p>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            +{tags.length - 3}
          </span>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Gaji</p>
          <p className="text-xs font-semibold text-gray-900 line-clamp-1">
            {isPaid && salary ? salary : 'Unpaid'}
          </p>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Durasi</p>
          <p className="text-xs font-semibold text-gray-900">{duration}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Posted</p>
          <p className="text-xs font-semibold text-gray-900">{postedDate}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-md flex-shrink-0 ${
          isPaid 
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}>
          {isPaid ? 'Berbayar' : 'Unpaid'}
        </span>
        <button
          onClick={() => onApply(id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm rounded-lg font-medium transition-all hover:shadow-lg"
        >
          Lamar Sekarang
        </button>
      </div>
    </div>
  );
};

const ApprenticeshipTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [internships, setInternships] = useState(mockInternships);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const { toast } = useToast();

  const handleApply = (id: string) => {
    const internship = internships.find(i => i.id === id);
    if (internship) {
      setSelectedInternship(internship);
      setShowApplyModal(true);
    }
  };

  const handleBookmark = (id: string) => {
    setInternships(prev => 
      prev.map(internship => 
        internship.id === id 
          ? { ...internship, isBookmarked: !internship.isBookmarked }
          : internship
      )
    );
    
    const internship = internships.find(i => i.id === id);
    toast({
      title: internship?.isBookmarked ? "Bookmark Removed" : "Bookmark Added",
      description: internship?.isBookmarked 
        ? "Internship removed from bookmarks" 
        : "Internship added to bookmarks",
    });
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBookmark = showBookmarked ? internship.isBookmarked : true;
    
    return matchesSearch && matchesBookmark;
  });

  const stats = [
    { label: 'Total Magang', value: mockInternships.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Berbayar', value: mockInternships.filter(i => i.isPaid).length, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Disimpan', value: mockInternships.filter(i => i.isBookmarked).length, icon: Bookmark, color: 'bg-purple-500' },
    { label: 'Tersedia', value: mockInternships.length, icon: Target, color: 'bg-orange-500' }
  ];

  const locationData = [
    { label: 'Jakarta', value: 2, color: 'bg-blue-500' },
    { label: 'Bandung', value: 1, color: 'bg-primary-500' },
    { label: 'Surabaya', value: 1, color: 'bg-purple-500' },
    { label: 'Yogyakarta', value: 1, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apprenticeship Tracker</h1>
          <p className="text-gray-600">Find and track your internship applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Location Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribusi Lokasi</h3>
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <ProgressChart data={locationData} maxValue={3} />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search internships, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showBookmarked ? "default" : "outline"}
                onClick={() => setShowBookmarked(!showBookmarked)}
                className="flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Bookmarked
              </Button>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''}
            {showBookmarked && ' (bookmarked only)'}
          </p>
        </div>

        {/* Internship Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              {...internship}
              onApply={handleApply}
              onBookmark={handleBookmark}
            />
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">
              {showBookmarked 
                ? "You haven't bookmarked any internships yet." 
                : "Try adjusting your search terms or filters."}
            </p>
          </div>
        )}
      </div>

      {/* Apply Job Modal */}
      {selectedInternship && (
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedInternship(null);
          }}
          jobData={{
            title: selectedInternship.position,
            company: selectedInternship.company.name,
            location: selectedInternship.company.location,
            salary: selectedInternship.salary,
            type: selectedInternship.duration
          }}
        />
      )}
    </div>
  );
};

export default ApprenticeshipTracker;
