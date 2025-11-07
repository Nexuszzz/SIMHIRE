// ============================================
// SHARED TYPE DEFINITIONS
// ============================================
// This file contains unified types used across the application
// to ensure consistency between candidate and company features

/**
 * Unified salary range type
 * Used by both Job (candidate view) and JobPost (company view)
 */
export interface SalaryRange {
  min: number;
  max: number;
  currency: 'IDR' | 'USD';
}

/**
 * Employment type options
 */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

/**
 * Experience level options
 */
export type ExperienceLevel = 'entry' | 'mid' | 'senior';

/**
 * Location mode options
 */
export type LocationMode = 'remote' | 'hybrid' | 'on-site';

/**
 * Application status from candidate perspective
 */
export type ApplicationStatus = 
  | 'applied'      // Just submitted
  | 'screening'    // Under review
  | 'interview'    // Interview scheduled
  | 'offer'        // Offer extended
  | 'accepted'     // Candidate accepted
  | 'rejected';    // Application rejected

/**
 * Job status (company perspective)
 */
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

/**
 * User role types
 */
export type UserRole = 'candidate' | 'company' | 'admin';

/**
 * Currency options
 */
export type Currency = 'IDR' | 'USD';

/**
 * Company size categories
 */
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';

/**
 * Hiring status options
 */
export type HiringStatus = 'active' | 'not_hiring' | 'paused';
