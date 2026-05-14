import React, { useEffect, useState, type ReactNode, type ErrorInfo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uploadImage } from "@/lib/supabase";
import { logoutAdmin } from "@/lib/auth";
import {
  getProjects,
  saveProjects,
  getServices,
  saveServices,
  getSkills,
  saveSkills,
  getTestimonials,
  saveTestimonials,
  getBannerImage,
  saveBannerImage,
  getLogo,
  saveLogo,
  getName,
  saveName,
  getSiteTitle,
  saveSiteTitle,
  getFavicon,
  saveFavicon,
  type Project,
  type ServiceData,
  type SkillCategory,
  type Testimonial,
} from "@/lib/admin-data";

// Error Boundary for Admin Panel
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin panel error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7dcdc] flex items-center justify-center p-8">
          <div className="glass rounded-3xl border border-white/10 p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Panel Error</h2>
            <p className="text-slate-700 mb-4">
              Something went wrong. This could be due to corrupted saved data.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  try {
                    // Clear potentially corrupted admin data
                    const keys = [
                      "admin-projects", "admin-services", "admin-skills", "admin-testimonials",
                      "admin-banner-image", "admin-logo", "admin-name", "admin-site-title", "admin-favicon"
                    ];
                    keys.forEach(k => localStorage.removeItem(k));
                    // Keep auth state, just reload
                    location.reload();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Reset Admin Data & Reload
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("admin-authenticated");
                  } catch { }
                  window.location.href = "/login";
                }}
                className="w-full rounded-full bg-rose-500/20 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-500/30"
              >
                Logout & Return to Login
              </button>
            </div>
            {this.state.error && (
              <pre className="mt-4 text-xs text-left bg-black/10 p-3 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const tabs = [
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "testimonials", label: "Testimonials" },
  { id: "hero", label: "Hero" },
];

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [status, setStatus] = useState("");
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [services, setServices] = useState<ServiceData[]>(() => getServices());
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => getSkills());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getTestimonials());
  const [bannerImage, setBannerImage] = useState<string>(() => getBannerImage());
  const [logo, setLogo] = useState<string>(() => getLogo());
  const [name, setName] = useState<string>(() => getName());
  const [siteTitle, setSiteTitle] = useState<string>(() => getSiteTitle());
  const [favicon, setFavicon] = useState<string>(() => getFavicon());

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    setProjects(getProjects());
    setServices(getServices());
    setSkillCategories(getSkills());
    setTestimonials(getTestimonials());
    setBannerImage(getBannerImage());
    setLogo(getLogo());
    setName(getName());
    setSiteTitle(getSiteTitle());
    setFavicon(getFavicon());
  }, []);

  const saveSection = () => {
    if (activeTab === "projects") {
      saveProjects(projects);
      setStatus("Projects saved.");
    }
    if (activeTab === "services") {
      saveServices(services);
      setStatus("Services saved.");
    }
    if (activeTab === "skills") {
      saveSkills(skillCategories);
      setStatus("Skills saved.");
    }
    if (activeTab === "testimonials") {
      saveTestimonials(testimonials);
      setStatus("Testimonials saved.");
    }
    if (activeTab === "hero") {
      saveBannerImage(bannerImage);
      saveLogo(logo);
      saveName(name);
      saveSiteTitle(siteTitle);
      saveFavicon(favicon);
      window.dispatchEvent(new Event("site-metadata-updated"));
      setStatus("Hero settings saved.");
    }
    window.setTimeout(() => setStatus(""), 3000);
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const next = [...projects];
    if (field === "techs") {
      next[index].techs = value.split(",").map((item) => item.trim()).filter(Boolean);
    } else {
      next[index] = { ...next[index], [field]: value };
    }
    setProjects(next);
  };

  const updateService = (index: number, field: keyof ServiceData, value: string) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: value };
    setServices(next);
  };

  const updateSkillCategory = (categoryIndex: number, field: keyof SkillCategory, value: string) => {
    const next = [...skillCategories];
    next[categoryIndex] = { ...next[categoryIndex], [field]: value };
    setSkillCategories(next);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, field: "name" | "level", value: string) => {
    const next = [...skillCategories];
    const skill = next[categoryIndex].skills[skillIndex];
    next[categoryIndex].skills[skillIndex] = {
      ...skill,
      [field]: field === "level" ? Number(value) : value,
    };
    setSkillCategories(next);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const next = [...testimonials];
    next[index] = { ...next[index], [field]: field === "rating" ? Number(value) : value } as Testimonial;
    setTestimonials(next);
  };

  const generateTestimonial = async () => {
    try {
      const response = await fetch('/api/generate-testimonial', { method: 'POST' });
      const newTestimonial = await response.json();
      setTestimonials([...testimonials, newTestimonial]);
    } catch (error) {
      console.error('Failed to generate testimonial', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, projectIdx: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      updateProject(projectIdx, "image", imageUrl);
    } catch (error) {
      console.error('Failed to upload image', error);
    }
  };

  return (
    <AdminErrorBoundary>
      <div className="bg-[#f7dcdc] min-h-screen text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-blue-600/80">Admin Panel</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900">Edit site content</h1>
              <p className="mt-4 max-w-2xl text-slate-600 leading-8">
                Update homepage content from here and see the changes immediately in the frontend.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  navigate("/login");
                }}
                className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-100 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-200"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.section>

        <div className="glass rounded-3xl border border-white/10 p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/10 p-6 mb-8">
          {activeTab === "projects" && (
            <div className="space-y-6">
              {projects.map((project, projectIdx) => (
                <div key={projectIdx} className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <label className="flex-1 min-w-[220px] text-sm text-gray-200">
                      Title
                      <input
                        value={project.title}
                        onChange={(event) => updateProject(projectIdx, "title", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="flex-1 min-w-[220px] text-sm text-gray-200">
                      Category
                      <input
                        value={project.category}
                        onChange={(event) => updateProject(projectIdx, "category", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="flex-1 min-w-[220px] text-sm text-gray-200">
                      Image URL / Upload
                      <input
                        value={project.image}
                        onChange={(event) => updateProject(projectIdx, "image", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                        placeholder="Enter image URL or upload file"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleImageUpload(event, projectIdx)}
                        className="mt-2 w-full text-sm text-gray-300"
                      />
                    </label>
                  </div>
                  <label className="block text-sm text-gray-200 mb-4">
                    Description
                    <textarea
                      value={project.description}
                      onChange={(event) => updateProject(projectIdx, "description", event.target.value)}
                      className="mt-2 w-full min-h-[100px] rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    />
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="text-sm text-gray-200">
                      Techs (comma separated)
                      <input
                        value={project.techs.join(", ")}
                        onChange={(event) => updateProject(projectIdx, "techs", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-sm text-gray-200">
                      Live link
                      <input
                        value={project.link}
                        onChange={(event) => updateProject(projectIdx, "link", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-sm text-gray-200">
                      GitHub link
                      <input
                        value={project.github}
                        onChange={(event) => updateProject(projectIdx, "github", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProjects(projects.filter((_, idx) => idx !== projectIdx))}
                    className="mt-5 rounded-full bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                  >
                    Remove Project
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setProjects([...projects, {
                  title: "",
                  description: "",
                  image: "📌",
                  techs: [],
                  category: "web",
                  link: "#",
                  github: "#",
                }])}
                className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add Project
              </button>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              {services.map((service, serviceIdx) => (
                <div key={serviceIdx} className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="text-sm text-gray-200">
                      Icon name
                      <input
                        value={service.icon}
                        onChange={(event) => updateService(serviceIdx, "icon", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-sm text-gray-200">
                      Color class
                      <input
                        value={service.color}
                        onChange={(event) => updateService(serviceIdx, "color", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                  </div>
                  <label className="block text-sm text-gray-200 mb-4">
                    Title
                    <input
                      value={service.title}
                      onChange={(event) => updateService(serviceIdx, "title", event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    />
                  </label>
                  <label className="block text-sm text-gray-200 mb-4">
                    Description
                    <textarea
                      value={service.description}
                      onChange={(event) => updateService(serviceIdx, "description", event.target.value)}
                      className="mt-2 w-full min-h-[100px] rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((_, idx) => idx !== serviceIdx))}
                    className="rounded-full bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                  >
                    Remove Service
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setServices([...services, {
                  icon: "Code",
                  title: "",
                  description: "",
                  color: "from-cyan-500",
                }])}
                className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add Service
              </button>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              {skillCategories.map((category, categoryIdx) => (
                <div key={categoryIdx} className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="text-sm text-gray-200">
                      Category title
                      <input
                        value={category.title}
                        onChange={(event) => updateSkillCategory(categoryIdx, "title", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setSkillCategories(skillCategories.filter((_, idx) => idx !== categoryIdx))}
                      className="self-end rounded-full bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                    >
                      Remove Category
                    </button>
                  </div>

                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <label className="text-sm text-gray-200">
                        Skill name
                        <input
                          value={skill.name}
                          onChange={(event) => updateSkill(categoryIdx, skillIdx, "name", event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                        />
                      </label>
                      <label className="text-sm text-gray-200">
                        Level
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={skill.level}
                          onChange={(event) => updateSkill(categoryIdx, skillIdx, "level", event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...skillCategories];
                          next[categoryIdx].skills = next[categoryIdx].skills.filter((_, idx) => idx !== skillIdx);
                          setSkillCategories(next);
                        }}
                        className="self-end rounded-full bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                      >
                        Remove Skill
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...skillCategories];
                      next[categoryIdx].skills.push({ name: "", level: 60 });
                      setSkillCategories(next);
                    }}
                    className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    Add Skill
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSkillCategories([...skillCategories, { title: "New Category", skills: [{ name: "", level: 70 }] }])}
                className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add Skill Category
              </button>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-6">
              {testimonials.map((testimonial, testimonialIdx) => (
                <div key={testimonialIdx} className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="text-sm text-gray-200">
                      Name
                      <input
                        value={testimonial.name}
                        onChange={(event) => updateTestimonial(testimonialIdx, "name", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-sm text-gray-200">
                      Role
                      <input
                        value={testimonial.role}
                        onChange={(event) => updateTestimonial(testimonialIdx, "role", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <label className="text-sm text-gray-200">
                      Avatar initials
                      <input
                        value={testimonial.avatar}
                        onChange={(event) => updateTestimonial(testimonialIdx, "avatar", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-sm text-gray-200">
                      Rating
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={testimonial.rating}
                        onChange={(event) => updateTestimonial(testimonialIdx, "rating", event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== testimonialIdx))}
                      className="self-end rounded-full bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/30"
                    >
                      Remove Testimonial
                    </button>
                  </div>
                  <label className="block text-sm text-gray-200 mb-4">
                    Quote
                    <textarea
                      value={testimonial.text}
                      onChange={(event) => updateTestimonial(testimonialIdx, "text", event.target.value)}
                      className="mt-2 w-full min-h-[100px] rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    />
                  </label>
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={generateTestimonial}
                  className="rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-400"
                >
                  Generate with AI
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonials([...testimonials, {
                    name: "",
                    role: "",
                    text: "",
                    rating: 5,
                    avatar: "AA",
                  }])}
                  className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Add Testimonial
                </button>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                <label className="block text-sm text-gray-200 mb-4">
                  Site Title
                  <input
                    value={siteTitle}
                    onChange={(event) => setSiteTitle(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    placeholder="Enter site title"
                  />
                </label>
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                <label className="block text-sm text-gray-200 mb-4">
                  Favicon URL
                  <input
                    value={favicon}
                    onChange={(event) => setFavicon(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    placeholder="Enter favicon URL"
                  />
                </label>
                {favicon && (
                  <div className="mt-4 flex items-center gap-4">
                    <p className="text-sm text-gray-400">Preview:</p>
                    <img
                      src={favicon}
                      alt="Favicon Preview"
                      className="w-12 h-12 object-cover rounded-xl border border-white/10"
                    />
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                <label className="block text-sm text-gray-200 mb-4">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    placeholder="Enter name"
                  />
                </label>
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                <label className="block text-sm text-gray-200 mb-4">
                  Logo Image URL
                  <input
                    value={logo}
                    onChange={(event) => setLogo(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    placeholder="Enter logo URL"
                  />
                </label>
                {logo && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={logo}
                      alt="Logo Preview"
                      className="w-24 h-24 object-cover rounded-full border border-white/10"
                    />
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-white/10 p-6 bg-slate-950/40">
                <label className="block text-sm text-gray-200 mb-4">
                  Hero Banner Image URL
                  <input
                    value={bannerImage}
                    onChange={(event) => setBannerImage(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white"
                    placeholder="Enter image URL"
                  />
                </label>
                {bannerImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={bannerImage}
                      alt="Hero Banner Preview"
                      className="w-full h-48 object-cover rounded-3xl border border-white/10"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={saveSection}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Save {tabs.find((tab) => tab.id === activeTab)?.label}
            </button>
            {status && <p className="text-sm text-emerald-300">{status}</p>}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </AdminErrorBoundary>
  );
}
