// Comprehensive localStorage management system for SimHire
// Handles applications, saved jobs, interviews, simulasi results, etc.

import { handleError } from './errors';

// ==================== INTERFACES ====================

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  appliedAt: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  notes?: string;
  timeline?: ApplicationTimeline[];
}

export interface ApplicationTimeline {
  date: string;
  status: string;
  description: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  type: string;
  savedAt: string;
}

export interface Interview {
  id: string;
  applicationId?: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  scheduledAt: string;
  duration?: number; // in minutes
  location?: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  notes?: string;
  interviewerName?: string;
  interviewerEmail?: string;
}

export interface SavedSimulasiResult {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  rank?: number;
  badge?: string;
  certificate?: string;
  breakdown: {
    technical: number;
    creativity: number;
    efficiency: number;
    communication: number;
  };
}

export interface ApprenticeshipApplication {
  id: string;
  opportunityId: string;
  title: string;
  company: string;
  location: string;
  appliedAt: string;
  status: 'applied' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  startDate?: string;
  endDate?: string;
}

// ==================== STORAGE KEYS ====================

const KEYS = {
  APPLICATIONS: 'simhire_applications',
  SAVED_JOBS: 'simhire_saved_jobs',
  INTERVIEWS: 'simhire_interviews',
  SIMULASI_RESULTS: 'simhire_simulasi_results',
  APPRENTICESHIPS: 'simhire_apprenticeships',
} as const;

// ==================== HELPER FUNCTIONS ====================

function safeLoad<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    handleError(error, `Failed to load ${key} from storage`);
    return defaultValue;
  }
}

function safeSave<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    handleError(error, `Failed to save ${key} to storage`);
    return false;
  }
}

// ==================== APPLICATIONS ====================

export function loadApplications(): Application[] {
  return safeLoad<Application[]>(KEYS.APPLICATIONS, []);
}

export function saveApplication(app: Application): boolean {
  const apps = loadApplications();
  apps.push(app);
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function updateApplication(id: string, updates: Partial<Application>): boolean {
  const apps = loadApplications();
  const index = apps.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  apps[index] = { ...apps[index], ...updates };
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function updateApplicationStatus(
  id: string, 
  status: Application['status'],
  timelineEntry?: string
): boolean {
  const apps = loadApplications();
  const index = apps.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  apps[index].status = status;
  
  if (timelineEntry) {
    if (!apps[index].timeline) apps[index].timeline = [];
    apps[index].timeline?.push({
      date: new Date().toISOString(),
      status,
      description: timelineEntry,
    });
  }
  
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function deleteApplication(id: string): boolean {
  const apps = loadApplications().filter(a => a.id !== id);
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function getApplicationById(id: string): Application | null {
  return loadApplications().find(a => a.id === id) || null;
}

export function hasAppliedToJob(jobId: string): boolean {
  return loadApplications().some(a => a.jobId === jobId);
}

// ==================== SAVED JOBS ====================

export function loadSavedJobs(): SavedJob[] {
  return safeLoad<SavedJob[]>(KEYS.SAVED_JOBS, []);
}

export function saveJob(job: SavedJob): boolean {
  const jobs = loadSavedJobs();
  
  // Don't save duplicate
  if (jobs.some(j => j.jobId === job.jobId)) {
    return false;
  }
  
  jobs.push(job);
  return safeSave(KEYS.SAVED_JOBS, jobs);
}

export function unsaveJob(jobId: string): boolean {
  const jobs = loadSavedJobs().filter(j => j.jobId !== jobId);
  return safeSave(KEYS.SAVED_JOBS, jobs);
}

export function isJobSaved(jobId: string): boolean {
  return loadSavedJobs().some(j => j.jobId === jobId);
}

export function toggleSaveJob(job: SavedJob): boolean {
  if (isJobSaved(job.jobId)) {
    return unsaveJob(job.jobId);
  } else {
    return saveJob(job);
  }
}

// ==================== INTERVIEWS ====================

export function loadInterviews(): Interview[] {
  return safeLoad<Interview[]>(KEYS.INTERVIEWS, []);
}

export function saveInterview(interview: Interview): boolean {
  const interviews = loadInterviews();
  interviews.push(interview);
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function updateInterview(id: string, updates: Partial<Interview>): boolean {
  const interviews = loadInterviews();
  const index = interviews.findIndex(i => i.id === id);
  
  if (index === -1) return false;
  
  interviews[index] = { ...interviews[index], ...updates };
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function deleteInterview(id: string): boolean {
  const interviews = loadInterviews().filter(i => i.id !== id);
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function getUpcomingInterviews(): Interview[] {
  const now = new Date();
  return loadInterviews()
    .filter(i => i.status === 'confirmed' || i.status === 'pending')
    .filter(i => new Date(i.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}

// ==================== SIMULASI RESULTS ====================

export function loadSimulasiResults(): SavedSimulasiResult[] {
  return safeLoad<SavedSimulasiResult[]>(KEYS.SIMULASI_RESULTS, []);
}

export function saveSimulasiResult(result: SavedSimulasiResult): boolean {
  const results = loadSimulasiResults();
  
  // Remove old result for same category
  const filtered = results.filter(r => r.categoryId !== result.categoryId);
  filtered.push(result);
  
  return safeSave(KEYS.SIMULASI_RESULTS, filtered);
}

export function getSimulasiResultByCategory(categoryId: string): SavedSimulasiResult | null {
  return loadSimulasiResults().find(r => r.categoryId === categoryId) || null;
}

export function getUserBadges(): string[] {
  return loadSimulasiResults()
    .filter(r => r.badge)
    .map(r => r.badge as string);
}

export function getAverageSimulasiScore(): number {
  const results = loadSimulasiResults();
  if (results.length === 0) return 0;
  
  const total = results.reduce((sum, r) => sum + r.percentage, 0);
  return Math.round(total / results.length);
}

// ==================== APPRENTICESHIPS ====================

export function loadApprenticeships(): ApprenticeshipApplication[] {
  return safeLoad<ApprenticeshipApplication[]>(KEYS.APPRENTICESHIPS, []);
}

export function saveApprenticeshipApplication(app: ApprenticeshipApplication): boolean {
  const apps = loadApprenticeships();
  apps.push(app);
  return safeSave(KEYS.APPRENTICESHIPS, apps);
}

export function updateApprenticeshipStatus(
  id: string,
  status: ApprenticeshipApplication['status']
): boolean {
  const apps = loadApprenticeships();
  const index = apps.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  apps[index].status = status;
  return safeSave(KEYS.APPRENTICESHIPS, apps);
}

export function hasAppliedToApprenticeship(opportunityId: string): boolean {
  return loadApprenticeships().some(a => a.opportunityId === opportunityId);
}

// ==================== STATISTICS ====================

export function getApplicationStats() {
  const applications = loadApplications();
  
  return {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  };
}

export function getInterviewStats() {
  const interviews = loadInterviews();
  const now = new Date();
  
  return {
    total: interviews.length,
    upcoming: interviews.filter(i => 
      (i.status === 'confirmed' || i.status === 'pending') && 
      new Date(i.scheduledAt) > now
    ).length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
  };
}

export function getDashboardStats() {
  const apps = getApplicationStats();
  const interviews = getInterviewStats();
  const savedJobs = loadSavedJobs().length;
  const simulasiCompleted = loadSimulasiResults().length;
  
  return {
    applications: apps,
    interviews: interviews,
    savedJobs,
    simulasiCompleted,
  };
}

// ==================== DATA INITIALIZATION ====================

export function initializeSampleApplications(): void {
  const existing = loadApplications();
  
  if (existing.length === 0) {
    const sampleApps: Application[] = [
      {
        id: crypto.randomUUID(),
        jobId: 'job-001',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechStart Indonesia',
        location: 'Jakarta',
        salary: 'Rp 15.000.000 - Rp 20.000.000',
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'screening',
        timeline: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'applied',
            description: 'Application submitted',
          },
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'screening',
            description: 'Application under review',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        jobId: 'job-002',
        jobTitle: 'UI/UX Designer',
        company: 'Creative Digital',
        location: 'Bandung',
        salary: 'Rp 10.000.000 - Rp 15.000.000',
        appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'interview',
        timeline: [
          {
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'applied',
            description: 'Application submitted',
          },
          {
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'screening',
            description: 'Portfolio reviewed',
          },
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'interview',
            description: 'Interview scheduled',
          },
        ],
      },
    ];
    
    safeSave(KEYS.APPLICATIONS, sampleApps);
  }
}

// ==================== EXPORT ALL ====================

export default {
  // Applications
  loadApplications,
  saveApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationById,
  hasAppliedToJob,
  
  // Saved Jobs
  loadSavedJobs,
  saveJob,
  unsaveJob,
  isJobSaved,
  toggleSaveJob,
  
  // Interviews
  loadInterviews,
  saveInterview,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews,
  
  // Simulasi
  loadSimulasiResults,
  saveSimulasiResult,
  getSimulasiResultByCategory,
  getUserBadges,
  getAverageSimulasiScore,
  
  // Apprenticeships
  loadApprenticeships,
  saveApprenticeshipApplication,
  updateApprenticeshipStatus,
  hasAppliedToApprenticeship,
  
  // Stats
  getApplicationStats,
  getInterviewStats,
  getDashboardStats,
  
  // Init
  initializeSampleApplications,
};
