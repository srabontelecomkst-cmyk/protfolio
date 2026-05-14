import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { getBannerImage, getLogo, getName } from "@/lib/admin-data";

const Hero = () => {
  const [displayedText, setDisplayedText] = useState("");
  const roles = [
    "React Developer",
    "SaaS Engineer",
    "Mobile App Developer",
    "UI/UX Designer",
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [bannerImage, setBannerImage] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const role = roles[currentRoleIndex];
    let index = 0;

    const interval = setInterval(() => {
      if (index <= role.length) {
        setDisplayedText(role.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setDisplayedText("");
        }, 3000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentRoleIndex]);

  useEffect(() => {
    setBannerImage(getBannerImage());
    setLogo(getLogo());
    setName(getName());
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden pt-20">
      {/* Hero Banner */}
      {bannerImage && (
        <div className="absolute top-0 left-0 w-full h-64 md:h-80 overflow-hidden">
          <img
            src={bannerImage}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50 -z-10"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50 -z-10" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50 -z-10" style={{ animationDelay: "4s" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side */}
          <div className="flex flex-col justify-center gap-8">
            {/* Badge */}
            <motion.div variants={item} className="inline-flex w-fit">
              <div className="glass px-4 py-2 rounded-full text-sm font-medium text-blue-600 border border-blue-500/30 bg-blue-50">
                ✨ Available for Freelance
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={item}>
              <h1 className="font-poppins font-bold leading-tight">
                <span className="block text-gray-900">Full Stack Web &amp; App</span>
                <span className="block gradient-text">Developer in Bangladesh AI</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="text-lg text-gray-600 max-w-md"
            >
              Full Stack development with AI-powered solutions, modern UI/UX, and fast delivery.
            </motion.p>

            <motion.p
              variants={item}
              className="text-sm font-medium text-blue-700"
            >
              WhatsApp: +8801810902817
            </motion.p>

            {/* Typing animation */}
            <motion.div
              variants={item}
              className="glass px-6 py-4 rounded-2xl border-l-2 border-blue-500 bg-white/80"
            >
              <p className="text-base font-medium text-gray-700">
                <span className="text-blue-600">→ </span>
                {displayedText}
                <span className="animate-pulse text-blue-600 ml-1">|</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow text-white px-8 py-4 text-base font-semibold bg-blue-600 hover:bg-blue-700"
              >
                Hire Me
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border-2 border-blue-500/50 text-blue-600 font-semibold hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 bg-white"
              >
                View Projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-white"
              >
                Download CV
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={item} className="flex gap-4 pt-4">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-300 bg-white/80"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Illustration Placeholder */}
          <motion.div
            variants={item}
            className="hidden md:flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="relative w-full max-w-sm"
            >
              {/* Glowing circles */}
              {[
                { size: "w-96 h-96", delay: 0, color: "from-purple-500" },
                { size: "w-80 h-80", delay: 0.5, color: "from-blue-500" },
                { size: "w-64 h-64", delay: 1, color: "from-cyan-500" },
              ].map((circle, idx) => (
                <motion.div
                  key={idx}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20 + idx * 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`absolute inset-0 rounded-full border border-gradient-to-br ${circle.color} to-transparent opacity-30`}
                />
              ))}

              {/* Profile card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative glass p-8 rounded-3xl text-center bg-white/90"
              >
                <div className="w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-blue-200">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-poppins font-bold text-gray-900 mb-2">
                  {name}
                </h3>
                <p className="text-sm text-gray-500">Full Stack Developer</p>
                <div className="flex gap-2 justify-center mt-4">
                  {["React", "Node", "Design"].map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Floating tech icons */}
              {[
                { icon: "⚛", delay: 0 },
                { icon: "🎨", delay: 1 },
                { icon: "⚡", delay: 2 },
                { icon: "📱", delay: 3 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.cos(idx * Math.PI / 2) * 40, 0],
                  }}
                  transition={{
                    duration: 4,
                    delay: item.delay,
                    repeat: Infinity,
                  }}
                  className="absolute text-4xl"
                  style={{
                    top: `${20 + Math.sin(idx * Math.PI / 2) * 30}%`,
                    left: `${20 + Math.cos(idx * Math.PI / 2) * 30}%`,
                  }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <ArrowDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
};

export default Hero;
