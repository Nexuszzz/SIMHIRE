// Validation utilities for data validation before storage operations
import { z } from 'zod';
import { toast } from 'sonner';

/**
 * Validates data against a Zod schema and shows toast on error
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param showToast Whether to show toast notification on error
 * @returns Validated data or null if validation fails
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  showToast = true
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const errorMessage = firstError?.message || 'Data tidak valid';
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      console.error('Validation error:', error.issues);
      return null;
    }
    
    if (showToast) {
      toast.error('Terjadi kesalahan validasi');
    }
    
    console.error('Unexpected validation error:', error);
    return null;
  }
}

/**
 * Safe parse without throwing errors
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result with success flag and data/error
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, error: result.error };
}

/**
 * Get formatted error messages from Zod error
 * @param error Zod error object
 * @returns Array of error messages
 */
export function getErrorMessages(error: z.ZodError): string[] {
  return error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}

/**
 * Get first error message from Zod error
 * @param error Zod error object
 * @returns First error message
 */
export function getFirstError(error: z.ZodError): string {
  const messages = getErrorMessages(error);
  return messages[0] || 'Data tidak valid';
}
