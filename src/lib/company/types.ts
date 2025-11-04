// Company Dashboard Types & Interfaces
export type UserRole = 'candidate' | 'company' | 'admin';
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior';
export type LocationMode = 'remote' | 'hybrid' | 'on-site';
export type ApplicationStage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type ContractStatus = 'draft' | 'awaiting_funding' | 'funded' | 'in_progress' | 'submitted' | 'released' | 'cancelled' | 'disputed' | 'resolved' | 'active' | 'pending' | 'completed';

// Company Profile
export interface CompanyProfile {
  id: string;
  userId: string; // owner user ID
  name: string;
  logoUrl?: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  location: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  hiringStatus: 'active' | 'not_hiring' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// Job Post
export interface JobPost {
  id: string;
  companyId: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  locationMode: LocationMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: 'IDR' | 'USD';
  salaryRange?: {
    min?: number;
    max?: number;
    currency: 'IDR' | 'USD';
  };
  description: string;
  requirements: string[];
  benefits?: string[];
  skills: string[];
  status: JobStatus;
  isUrgent?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  applicationCount: number;
  viewCount: number;
}

// Job Application
export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  candidateSkills: string[];
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  stage: ApplicationStage;
  scoreOverall?: number; // 1-10
  reviewerNotes: string[];
  appliedAt: string;
  lastStageChange: string;
  interviewScheduled?: string;
  salaryExpectation?: number;
}

// Evaluation Template
export interface EvaluationTemplate {
  id: string;
  companyId: string;
  name: string;
  description: string;
  criteria: EvaluationCriteria[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCriteria {
  id: string;
  label: string;
  description?: string;
  weight: number; // percentage
  maxScore: number;
}

// Evaluation Instance (per application)
export interface ApplicationEvaluation {
  id: string;
  applicationId: string;
  templateId: string;
  evaluatorId: string; // user ID
  scores: Record<string, number>; // criteriaId -> score
  totalScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Talent Pool
export interface TalentPool {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  candidateIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Team Member
export interface TeamMember {
  id: string;
  companyId: string;
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'recruiter' | 'interviewer' | 'viewer';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
  status: 'pending' | 'active' | 'suspended';
}

// Escrow Contract
export interface EscrowContract {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  jobId?: string;
  title: string;
  description: string;
  amount: number;
  currency: 'IDR' | 'USD';
  duration: number; // months
  status: ContractStatus;
  milestones: ContractMilestone[];
  createdAt: string;
  fundedAt?: string;
  completedAt?: string;
  releasedAt?: string;
  disputeReason?: string;
}

export interface ContractMilestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'disputed';
}

// Activity Event
export interface ActivityEvent {
  id: string;
  companyId: string;
  actorId: string; // user ID
  actorName: string;
  entityType: 'job' | 'application' | 'candidate' | 'contract' | 'team';
  entityId: string;
  action: string; // 'created', 'updated', 'deleted', 'stage_changed', etc.
  metadata: Record<string, any>;
  createdAt: string;
}

// Analytics Data
export interface CompanyMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  averageTimeToHire: number; // days
  conversionRate: number; // percentage
  topSkillsInDemand: Array<{ skill: string; count: number }>;
  applicationsByStage: Record<ApplicationStage, number>;
  applicationsOverTime: Array<{ date: string; count: number }>;
}

// Candidate Profile (Sanitized for Company View)
export interface CandidateProfile {
  id: string;
  name: string;
  email?: string; // only after interview stage
  title?: string;
  headline?: string;
  location?: string;
  skills: string[];
  experience?: number; // years of experience
  education?: string;
  availability?: 'available' | 'busy' | 'not_available' | 'open_to_offers' | 'not_looking';
  about?: string;
  salaryExpectation?: number | { min: number; max: number; currency: string };
  portfolioShared: boolean;
  resumeUrl?: string;
  profileCompleteness: number; // percentage
  lastActive: string;
  phone?: string;
  portfolio?: string;
  createdAt?: string;
  updatedAt?: string;
  applicationHistory: Array<{
    jobTitle: string;
    companyName: string;
    stage: ApplicationStage;
    appliedAt: string;
  }>;
}

// Form Data Types
export interface CreateJobFormData {
  title: string;
  department: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  locationMode: LocationMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  isUrgent: boolean;
}

export interface UpdateApplicationStageData {
  applicationId: string;
  newStage: ApplicationStage;
  notes?: string;
  scheduledDate?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter & Search Types
export interface JobFilter {
  status?: JobStatus[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  department?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ApplicationFilter {
  stage?: ApplicationStage[];
  jobId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
}

export interface CandidateSearchFilter {
  skills?: string[];
  location?: string[];
  experience?: ExperienceLevel[];
  availability?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}
