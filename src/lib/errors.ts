import { toast } from 'sonner';

export function handleError(err: unknown, context?: string): string {
  const message = err instanceof Error ? err.message : String(err);
  const fullMessage = context ? `${context}: ${message}` : message;
  
  if (import.meta.env.DEV) {
    console.error(context ?? 'Error', err);
  }
  
  toast.error(fullMessage);
  
  return fullMessage;
}

export function handleSuccess(message: string, description?: string) {
  toast.success(message, description ? { description } : undefined);
}

export function handleWarning(message: string, description?: string) {
  toast.warning(message, description ? { description } : undefined);
}

export function handleInfo(message: string, description?: string) {
  toast.info(message, description ? { description } : undefined);
}
