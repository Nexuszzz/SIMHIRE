import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, Building2, FileText, TrendingUp, Bookmark } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ViewApplicationModal from '../components/modals/ViewApplicationModal';
import { loadApplications, loadSavedJobs, updateApplicationStatus, type Application as StoredApplication, type SavedJob } from '@/lib/storage';
import { toast } from 'sonner';

interface Application {
  id: string;
  company: {
    name: string;
    logo?: string;
  };
  position: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  progress: number;
  nextStep?: string;
  interviewDate?: string;
  location?: string;
  salary?: string;
}

// Convert storage application to display format
const convertApplication = (app: StoredApplication): Application => {
  // Calculate progress based on status
  const progressMap: Record<StoredApplication['status'], number> = {
    applied: 20,
    screening: 40,
    interview: 70,
    offer: 90,
    accepted: 100,
    rejected: 50,
  };

  const nextStepMap: Record<StoredApplication['status'], string> = {
    applied: 'Waiting for Review',
    screening: 'Application Screening',
    interview: 'Interview Schedule',
    offer: 'Offer Review',
    accepted: 'Onboarding',
    rejected: 'Application Closed',
  };

  return {
    id: app.id,
    company: {
      name: app.company,
      logo: app.companyLogo,
    },
    position: app.jobTitle,
    appliedDate: new Date(app.appliedAt).toISOString().split('T')[0],
    status: app.status,
    progress: progressMap[app.status],
    nextStep: nextStepMap[app.status],
    location: app.location,
    salary: app.salary,
  };
};

const getStatusIcon = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return <Clock className="w-4 h-4" />;
    case 'screening':
      return <FileText className="w-4 h-4" />;
    case 'interview':
      return <AlertCircle className="w-4 h-4" />;
    case 'offer':
      return <TrendingUp className="w-4 h-4" />;
    case 'accepted':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'screening':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'interview':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'offer':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getProgressColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-500';
    case 'screening':
      return 'bg-yellow-500';
    case 'interview':
      return 'bg-purple-500';
    case 'offer':
      return 'bg-green-500';
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const ApplicationTracker: React.FC = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'saved'>('applications');

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedApps = loadApplications();
    const convertedApps = storedApps.map(convertApplication);
    setApplications(convertedApps);

    const storedSaved = loadSavedJobs();
    setSavedJobs(storedSaved);
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (appId: string, newStatus: StoredApplication['status']) => {
    const success = updateApplicationStatus(appId, newStatus);
    if (success) {
      loadData(); // Reload data
      toast.success('Status updated successfully');
    } else {
      toast.error('Failed to update status');
    }
  };

  // Calculate stats from actual data
  const stats = [
    { 
      label: 'Total Lamaran', 
      value: applications.length, 
      icon: FileText, 
      color: 'bg-blue-500', 
      trend: applications.length > 0 ? `${applications.length} total` : 'No applications yet' 
    },
    { 
      label: 'Under Review', 
      value: applications.filter(a => a.status === 'applied' || a.status === 'screening').length, 
      icon: Clock, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Interview', 
      value: applications.filter(a => a.status === 'interview').length, 
      icon: AlertCircle, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Success', 
      value: applications.filter(a => a.status === 'accepted' || a.status === 'offer').length, 
      icon: TrendingUp, 
      color: 'bg-green-500' 
    }
  ];

  // Calculate activity data from applications (group by month)
  const getActivityData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { month: d.getMonth(), year: d.getFullYear() };
    });

    return last6Months.map(({ month, year }) => {
      const count = applications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === month && appDate.getFullYear() === year;
      }).length;

      return {
        label: monthNames[month],
        value: count,
        color: 'bg-primary-500'
      };
    });
  };

  const activityData = getActivityData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Tracker</h1>
          <p className="text-gray-600">Track your internship application progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aktivitas Lamaran (6 Bulan Terakhir)
          </h3>
          <ProgressChart data={activityData} />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {applications.length} Lamaran Aktif
            </h2>
            <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
              Tracked
            </span>
          </div>
          
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-primary-300 transition-all group"
            >
              {/* Header with Logo */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  {application.company.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {application.position}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium line-clamp-1">{application.company.name}</p>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} border text-xs flex-shrink-0`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold text-gray-900">{application.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(application.status)}`}
                    style={{ width: `${application.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Applied</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {new Date(application.appliedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="flex items-center justify-center mb-1">
                    {application.interviewDate ? (
                      <Clock className="w-4 h-4 text-orange-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Interview</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {application.interviewDate 
                      ? new Date(application.interviewDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                      : 'Pending'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Next Step</p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {application.nextStep || 'Wait for response'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {application.status === 'interview' && (
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg flex-shrink-0"
                  >
                    Prepare Interview
                  </button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(application)}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building2 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">
              Start applying to internships to track your progress here.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Browse Internships
            </Button>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <ViewApplicationModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />
    </div>
  );
};

export default ApplicationTracker;
