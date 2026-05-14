import { motion } from "framer-motion";
import { Code, Smartphone, Palette, Zap, Layout, Database, Award, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, Circle, Dot, ExternalLink, Facebook, Github, GripVertical, Instagram, Linkedin, Mail, MapPin, Menu, MessageCircle, MessageSquare, MoreHorizontal, PanelLeft, Phone, Star, X, Search, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getServices, type ServiceData } from "@/lib/admin-data";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Palette,
  Zap,
  Layout,
  Database,
  Award,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Dot,
  ExternalLink,
  Facebook,
  Github,
  GripVertical,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  Phone,
  Star,
  X,
  Search,
};

const Services = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [services, setServices] = useState<ServiceData[]>(() => getServices());

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="services" className="py-20 md:py-32 relative overflow-hidden bg-[#f7dcdc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onMouseMove={handleMouseMove}
              className="group relative glass p-8 rounded-2xl cursor-pointer overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <div
                className="absolute pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300 w-32 h-32 rounded-full blur-3xl"
                style={{
                  background: `${service.color} to-transparent`,
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px] pointer-events-none">
                <div
                  className="w-full h-full rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${service.color} -10%, transparent 50%)`,
                  }}
                />
              </div>

               {/* Content */}
               <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl mb-6 bg-gradient-to-br ${service.color} to-transparent transition-all duration-300 group-hover:opacity-30`}>
                    {(() => {
                      const Icon = iconMap[service.icon] ?? Code;
                      return <Icon className="w-8 h-8 text-blue-600" />;
                    })()}
                  </div>

                <h3 className="text-xl font-poppins font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition-colors"
                >
                  Learn More →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
