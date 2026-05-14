import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Instagram, MessageCircle, ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "#", color: "hover:text-blue-600" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-500" },
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-500" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-blue-500" },
    { icon: MessageCircle, label: "WhatsApp", href: "#", color: "hover:text-blue-500" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-blue-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <div>
                <h3 className="font-poppins font-bold text-slate-900">Veltrix</h3>
                <p className="text-xs text-slate-600">Full Stack Developer</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Crafting beautiful and functional digital experiences with modern
              technologies.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-poppins font-semibold text-slate-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-poppins font-semibold text-slate-900 mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">
                <span className="text-blue-600">Email:</span>{" "}
                <a
                  href="mailto:asifkst20242300@gmail.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  asifkst20242300@gmail.com
                </a>
              </p>
              <p className="text-slate-600">
                <span className="text-blue-600">Phone:</span>{" "}
                <a
                  href="tel:01331707900"
                  className="hover:text-blue-600 transition-colors"
                >
                  01331707900
                </a>
              </p>
              <p className="text-slate-600">
                <span className="text-blue-600">Location:</span> Bangladesh
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-8" />

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full glass flex items-center justify-center text-slate-600 transition-colors ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500 text-center md:text-right">
            © {currentYear} Asif Shekh. All rights reserved.
          </p>
        </motion.div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-slate-900 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 z-40"
          aria-label="Back to top"
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowUp className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
