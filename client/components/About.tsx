import { motion } from "framer-motion";
import { Award, Code, Zap } from "lucide-react";

const About = () => {
  const badges = [
    { icon: Code, label: "Clean Code", color: "from-blue-500" },
    { icon: Zap, label: "Fast Performance", color: "from-purple-500" },
    { icon: Award, label: "Premium Design", color: "from-cyan-500" },
  ];

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">About Me</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transforming ideas into digital excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - Profile Image with gradient border */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-80 h-80 md:w-full md:max-w-sm">
              {/* Glowing border container */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 opacity-30 blur-3xl -z-10"></div>

              <motion.div
                animate={{
                  borderColor: [
                    "rgba(124, 58, 237, 0.5)",
                    "rgba(59, 130, 246, 0.5)",
                    "rgba(6, 182, 212, 0.5)",
                    "rgba(124, 58, 237, 0.5)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-full h-full rounded-3xl border-2 border-purple-500/50 overflow-hidden"
              >
<div className="w-full h-full bg-blue-50 flex items-center justify-center relative">
                  <div className="text-9xl font-bold text-slate-900">V</div>

                  {/* Floating shapes inside */}
                  <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-transparent"
                  />
                  <motion.div
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent"
                  />
                </div>
              </motion.div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass px-6 py-3 rounded-full flex items-center gap-2"
                >
                  <badge.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-poppins font-bold text-slate-900 mb-4">
                Passionate About Building Digital Experiences
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                I'm a Full Stack Developer and UI/UX Designer with 3+ years of
                experience crafting premium web and mobile applications. My
                expertise spans from architecting scalable backend systems to
                designing stunning user interfaces.
              </p>
              <p className="text-slate-600 leading-relaxed">
                My journey in tech has been driven by a passion for solving
                complex problems and creating seamless digital experiences that
                users love.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Frontend", value: "React, Next.js, Tailwind" },
                { label: "Backend", value: "Node, Express, Laravel" },
                { label: "Mobile", value: "React Native, Flutter" },
                { label: "Design", value: "Figma, UI/UX, Adobe" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass p-4 rounded-xl"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-slate-600">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow text-white px-8 py-3 text-sm font-semibold"
              >
                Download Resume
              </motion.button>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border-2 border-blue-500/50 text-blue-700 font-semibold hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 text-center text-sm"
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
