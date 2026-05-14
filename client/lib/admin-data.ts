export type Project = {
  title: string;
  description: string;
  image: string;
  techs: string[];
  category: string;
  link: string;
  github: string;
};

export type ServiceData = {
  icon: string;
  title: string;
  description: string;
  color: string;
};

export type Skill = {
  name: string;
  level: number;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
};

const STORAGE_KEYS = {
  projects: "admin-projects",
  services: "admin-services",
  skills: "admin-skills",
  testimonials: "admin-testimonials",
  bannerImage: "admin-banner-image",
  logo: "admin-logo",
  name: "admin-name",
  siteTitle: "admin-site-title",
  favicon: "admin-favicon",
};

function parseStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const defaultProjects: Project[] = [
  {
    title: "House Rent App",
    description: "Full-stack rental platform with advanced search and booking system",
    image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=House+Rent+App",
    techs: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "web",
    link: "#",
    github: "#",
  },
  {
    title: "HR SaaS System",
    description: "Enterprise HR management system with payroll and analytics",
    image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=HR+SaaS+System",
    techs: ["Next.js", "Express", "PostgreSQL", "Chart.js"],
    category: "saas",
    link: "#",
    github: "#",
  },
  {
    title: "Fiverr AI Extension",
    description: "Chrome extension for AI-powered freelance proposal writing",
    image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Fiverr+AI+Extension",
    techs: ["React", "OpenAI API", "Chrome APIs"],
    category: "web",
    link: "#",
    github: "#",
  },
];

export const defaultServices: ServiceData[] = [
  {
    icon: "Code",
    title: "Full Stack Web Development",
    description: "Build scalable, modern web applications with cutting-edge technologies",
    color: "from-blue-500",
  },
  {
    icon: "Smartphone",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps for iOS and Android",
    color: "from-purple-500",
  },
  {
    icon: "Palette",
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that users love to interact with",
    color: "from-pink-500",
  },
];

export const defaultSkills: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "TypeScript", level: 85 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 88 },
      { name: "Laravel", level: 82 },
      { name: "Supabase", level: 85 },
    ],
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc",
    text: "Asif delivered an exceptional portfolio platform that exceeded our expectations. His attention to detail and innovative design solutions made all the difference.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Product Manager, Digital Solutions",
    text: "Working with Asif was a game-changer. He combines technical expertise with creative thinking, delivering solutions that are both beautiful and functional.",
    rating: 5,
    avatar: "MC",
  },
];

export function getProjects() {
  return parseStorage<Project[]>(STORAGE_KEYS.projects, defaultProjects);
}

export function saveProjects(projects: Project[]) {
  saveStorage(STORAGE_KEYS.projects, projects);
}

export function getServices() {
  return parseStorage<ServiceData[]>(STORAGE_KEYS.services, defaultServices);
}

export function saveServices(services: ServiceData[]) {
  saveStorage(STORAGE_KEYS.services, services);
}

export function getSkills() {
  return parseStorage<SkillCategory[]>(STORAGE_KEYS.skills, defaultSkills);
}

export function saveSkills(skills: SkillCategory[]) {
  saveStorage(STORAGE_KEYS.skills, skills);
}

export function getTestimonials() {
  return parseStorage<Testimonial[]>(STORAGE_KEYS.testimonials, defaultTestimonials);
}

export function saveTestimonials(testimonials: Testimonial[]) {
  saveStorage(STORAGE_KEYS.testimonials, testimonials);
}

export function getBannerImage(): string {
  return parseStorage(STORAGE_KEYS.bannerImage, "https://via.placeholder.com/1920x600/3b82f6/ffffff?text=Hero+Banner");
}

export function saveBannerImage(image: string) {
  saveStorage(STORAGE_KEYS.bannerImage, image);
}

export function getLogo(): string {
  return parseStorage(STORAGE_KEYS.logo, "https://via.placeholder.com/150x150/3b82f6/ffffff?text=V");
}

export function saveLogo(logo: string) {
  saveStorage(STORAGE_KEYS.logo, logo);
}

export function getName(): string {
  return parseStorage(STORAGE_KEYS.name, "Veltrix");
}

export function saveName(name: string) {
  saveStorage(STORAGE_KEYS.name, name);
}

export function getSiteTitle(): string {
  return parseStorage(STORAGE_KEYS.siteTitle, "Hello world project");
}

export function saveSiteTitle(title: string) {
  saveStorage(STORAGE_KEYS.siteTitle, title);
}

export function getFavicon(): string {
  return parseStorage(
    STORAGE_KEYS.favicon,
    "https://via.placeholder.com/64x64/3b82f6/ffffff?text=V"
  );
}

export function saveFavicon(favicon: string) {
  saveStorage(STORAGE_KEYS.favicon, favicon);
}
