/**
 * Centralized constants untuk SIMHIRE platform
 * Manages storage keys, app config, and routes
 */

export const STORAGE_VERSION = 'v1';

/**
 * Standardized localStorage keys
 * Semua keys menggunakan prefix 'simhire_v1_' untuk menghindari collision
 */
export const STORAGE_KEYS = {
  // Candidate Data
  CANDIDATE_APPLICATIONS: `simhire_${STORAGE_VERSION}_candidate_applications`,
  CANDIDATE_SAVED_JOBS: `simhire_${STORAGE_VERSION}_candidate_saved_jobs`,
  CANDIDATE_INTERVIEWS: `simhire_${STORAGE_VERSION}_candidate_interviews`,
  CANDIDATE_SIMULASI: `simhire_${STORAGE_VERSION}_candidate_simulasi_results`,
  CANDIDATE_PORTFOLIO: `simhire_${STORAGE_VERSION}_candidate_portfolio`,
  CANDIDATE_APPRENTICESHIPS: `simhire_${STORAGE_VERSION}_candidate_apprenticeships`,
  
  // Company Data
  COMPANY_JOBS: `simhire_${STORAGE_VERSION}_company_jobs`,
  COMPANY_APPLICATIONS: `simhire_${STORAGE_VERSION}_company_applications`,
  COMPANY_TEAM: `simhire_${STORAGE_VERSION}_company_team`,
  COMPANY_PROFILE: `simhire_${STORAGE_VERSION}_company_profile`,
  
  // Shared
  USER_SESSION: `simhire_${STORAGE_VERSION}_user_session`,
  APP_SETTINGS: `simhire_${STORAGE_VERSION}_app_settings`,
} as const;

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx'],
  ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.webp'],
  
  // UI/UX
  DEBOUNCE_DELAY: 500, // milliseconds
  ITEMS_PER_PAGE: 20,
  TOAST_DURATION: 3000, // milliseconds
  
  // Simulasi
  SIMULASI_PASSING_SCORE: 70, // percentage
  SIMULASI_TIME_LIMIT: 45, // minutes
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Application routes
 */
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Candidate Dashboard
  DASHBOARD: '/dashboard',
  JOB_FINDER: '/dashboard/job-finder',
  APPLICATIONS: '/dashboard/applications',
  SIMULASI: '/dashboard/simulasi-kerja',
  SIMULASI_EXECUTION: '/dashboard/simulasi-kerja/:categoryId',
  SIMULASI_RESULTS: '/dashboard/simulasi-kerja/hasil/:resultId',
  SIMULASI_LEADERBOARD: '/dashboard/simulasi-kerja/leaderboard',
  PORTFOLIO: '/dashboard/portfolio',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  
  // Company Dashboard
  COMPANY: '/company',
  COMPANY_OVERVIEW: '/company/overview',
  COMPANY_JOBS: '/company/jobs',
  COMPANY_APPLICANTS: '/company/applicants',
  COMPANY_APPLICANT_DETAIL: '/company/applicants/:id',
  COMPANY_TALENT_SEARCH: '/company/talent-search',
  COMPANY_TEAM: '/company/team',
  COMPANY_SETTINGS: '/company/settings',
  COMPANY_ACTIVITY: '/company/activity',
  COMPANY_CREATE_JOB: '/company/jobs/create',
  COMPANY_EDIT_JOB: '/company/jobs/edit/:id',
  
  // Auth
  OAUTH_CALLBACK: '/auth/callback',
  OAUTH_GOOGLE: '/auth/google',
  OAUTH_LINKEDIN: '/auth/linkedin',
} as const;

/**
 * API Endpoints (for future backend integration)
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  JOBS: {
    LIST: '/api/jobs',
    DETAIL: '/api/jobs/:id',
    CREATE: '/api/jobs',
    UPDATE: '/api/jobs/:id',
    DELETE: '/api/jobs/:id',
    APPLY: '/api/jobs/:id/apply',
  },
  APPLICATIONS: {
    LIST: '/api/applications',
    DETAIL: '/api/applications/:id',
    UPDATE_STATUS: '/api/applications/:id/status',
  },
  SIMULASI: {
    LIST: '/api/simulasi',
    START: '/api/simulasi/:id/start',
    SUBMIT: '/api/simulasi/:id/submit',
    RESULTS: '/api/simulasi/results/:id',
    LEADERBOARD: '/api/simulasi/leaderboard',
  },
} as const;

/**
 * Status constants
 */
export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const JOB_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
} as const;

/**
 * User roles
 */
export const USER_ROLES = {
  CANDIDATE: 'candidate',
  COMPANY: 'company',
  ADMIN: 'admin',
} as const;

/**
 * Company team roles
 */
export const TEAM_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  VIEWER: 'viewer',
} as const;

// Type exports for TypeScript
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type TeamRole = typeof TEAM_ROLES[keyof typeof TEAM_ROLES];
