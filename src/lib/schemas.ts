import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const jobSchema = z.object({
  title: z.string().min(3, 'Judul pekerjaan minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi terlalu pendek'),
  location: z.string().optional(),
  status: z.enum(['open', 'paused', 'closed']).optional(),
  salary: z.union([z.string(), z.number()]).optional(),
});

export type JobSchema = z.infer<typeof jobSchema>;

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

export type ContactSchema = z.infer<typeof contactSchema>;
