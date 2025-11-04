// Portfolio feature data model and persistence utilities
// Local-only demo storage; can be replaced by Supabase later.

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string; // generated from title
  description: string;
  tech: string[];
  role?: string;
  startDate?: string; // YYYY-MM
  endDate?: string; // YYYY-MM or 'now'
  highlights: string[]; // bullet points
  links?: {
    demo?: string;
    repo?: string;
    video?: string;
    design?: string;
  };
  stats?: {
    users?: number;
    growthPercent?: number;
    revenue?: number;
  };
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  coverImage?: string; // URL or base64 (demo only)
}

const LS_KEY = 'wengdev.portfolio.v1';

export function loadProjects(): PortfolioProject[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveProjects(projects: PortfolioProject[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

export function upsertProject(project: PortfolioProject) {
  const projects = loadProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
  return project;
}

export function deleteProject(id: string) {
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
  return projects;
}

export function generateSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').slice(0,60);
}

export function createEmptyProject(partial?: Partial<PortfolioProject>): PortfolioProject {
  const now = new Date().toISOString();
  const base: PortfolioProject = {
    id: crypto.randomUUID(),
    title: 'Project Baru',
    slug: 'project-baru',
    description: '',
    tech: [],
    highlights: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
  base.slug = generateSlug(base.title);
  return base;
}

export function reorderProjects(projects: PortfolioProject[], orderedIds: string[]) {
  const map = new Map(projects.map(p => [p.id, p] as const));
  const reordered: PortfolioProject[] = [];
  orderedIds.forEach((id, index) => {
    const item = map.get(id);
    if (item) {
      reordered.push({ ...item, sortOrder: index });
    }
  });
  // add any missing (safety)
  projects.forEach(p => { if (!reordered.find(r => r.id === p.id)) reordered.push(p); });
  saveProjects(reordered);
  return reordered;
}

// Helper: ambil 3 project teratas (prioritas featured lalu updatedAt terbaru)
export function getTopProjects(limit = 3): PortfolioProject[] {
  const all = loadProjects();
  return [...all]
    .sort((a,b)=>{
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, limit);
}

// Get all unique technologies across projects
export function getAllTechnologies(): string[] {
  const projects = loadProjects();
  const techSet = new Set<string>();
  
  projects.forEach(project => {
    project.tech.forEach(tech => techSet.add(tech));
  });
  
  return Array.from(techSet).sort();
}

// Filter projects by query and technologies
export function filterProjects(
  query: string = '', 
  technologies: string[] = []
): PortfolioProject[] {
  const projects = loadProjects();
  
  return projects.filter(project => {
    // Filter by search query
    const matchesQuery = !query || 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.highlights.some(h => h.toLowerCase().includes(query.toLowerCase())) ||
      project.tech.some(t => t.toLowerCase().includes(query.toLowerCase()));
    
    // Filter by technologies
    const matchesTech = technologies.length === 0 || 
      technologies.every(tech => project.tech.includes(tech));
    
    return matchesQuery && matchesTech;
  }).sort((a,b)=>{
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

// Toggle featured status
export function toggleProjectFeatured(id: string): PortfolioProject | null {
  const projects = loadProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProject = {
    ...projects[index],
    featured: !projects[index].featured,
    updatedAt: new Date().toISOString()
  };
  
  projects[index] = updatedProject;
  saveProjects(projects);
  return updatedProject;
}

// Convert image file to base64 for storage
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Initialize with sample data if empty
export function initializeSampleData(): void {
  const existing = loadProjects();
  if (existing.length === 0) {
    const sampleProjects: Partial<PortfolioProject>[] = [
      {
        title: 'SimHire Platform',
        description: 'Platform pencarian kerja dengan fitur simulasi interview dan pelacakan aplikasi. Dibangun dengan React, TypeScript, dan Tailwind CSS untuk memberikan pengalaman pengguna yang optimal.',
        tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Router'],
        role: 'Full-stack Developer',
        startDate: '2024-01',
        endDate: 'now',
        highlights: [
          'Implementasi sistem autentikasi mock untuk keperluan demo',
          'Animasi page transitions yang smooth menggunakan Framer Motion',
          'Dashboard terintegrasi dengan berbagai tools pencarian kerja',
          'Responsive design untuk semua device'
        ],
        featured: true,
        links: {
          demo: 'https://simhire-demo.vercel.app',
          repo: 'https://github.com/nexus/simhire'
        }
      },
      {
        title: 'E-Commerce Dashboard',
        description: 'Dashboard admin untuk mengelola produk, order, dan analytics toko online. Dilengkapi dengan grafik interaktif dan sistem notifikasi real-time.',
        tech: ['Next.js', 'Chart.js', 'Prisma', 'PostgreSQL', 'Socket.io'],
        role: 'Frontend Developer',
        startDate: '2023-08',
        endDate: '2023-12',
        highlights: [
          'Real-time analytics dashboard dengan Chart.js',
          'Sistem notifikasi push untuk order baru',
          'Export data ke Excel dan PDF',
          'Dark mode support dengan persisten state'
        ],
        featured: false,
        stats: {
          users: 150,
          growthPercent: 45
        },
        links: {
          demo: 'https://ecommerce-dash.demo.com'
        }
      },
      {
        title: 'Personal Blog',
        description: 'Blog personal dengan sistem CMS custom, SEO optimized, dan loading yang sangat cepat. Menggunakan teknologi terbaru untuk performa maksimal.',
        tech: ['Astro', 'MDX', 'Tailwind CSS', 'Vercel', 'TypeScript'],
        role: 'Solo Developer',
        startDate: '2023-03',
        endDate: '2023-06',
        highlights: [
          'Performance score 100 di Google PageSpeed Insights',
          'Static generation untuk loading super cepat',
          'SEO optimized dengan meta tags otomatis',
          'Syntax highlighting untuk code blocks'
        ],
        featured: false,
        links: {
          demo: 'https://myblog.dev',
          repo: 'https://github.com/nexus/blog'
        }
      }
    ];
    
    sampleProjects.forEach(project => {
      const newProject = createEmptyProject(project);
      upsertProject(newProject);
    });
  }
}
