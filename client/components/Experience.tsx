import { motion } from "framer-motion";

const Experience = () => {
  const experiences = [
    {
      company: "Tech Startup Inc.",
      position: "Senior Full Stack Developer",
      duration: "2023 - Present",
      type: "Full-time",
      responsibilities: [
        "Led development of SaaS platform serving 10k+ users",
        "Architected scalable microservices infrastructure",
        "Mentored 3 junior developers",
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      color: "from-blue-500",
    },
    {
      company: "Digital Agency Pro",
      position: "Full Stack Developer",
      duration: "2022 - 2023",
      type: "Full-time",
      responsibilities: [
        "Developed 15+ web applications for clients",
        "Implemented responsive designs with Tailwind CSS",
        "Optimized app performance, reducing load time by 40%",
      ],
      technologies: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
      color: "from-purple-500",
    },
    {
      company: "Freelance",
      position: "Full Stack Developer & Designer",
      duration: "2021 - Present",
      type: "Self-employed",
      responsibilities: [
        "Delivered 50+ projects for global clients",
        "Designed and developed custom solutions",
        "Maintained 4.9/5 client rating",
      ],
      technologies: ["React", "Flutter", "Figma", "Node.js"],
      color: "from-cyan-500",
    },
  ];

  return (
    <section id="experience" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">Experience</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Professional journey and achievements
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 transform -translate-x-1/2"></div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex gap-8 md:gap-0 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex md:flex-col md:items-center md:w-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    className={`w-5 h-5 rounded-full bg-gradient-to-br ${exp.color} to-transparent border-4 border-[#0f172a]`}
                  />
                </div>

                {/* Content */}
                <div className="md:w-1/2">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className={`glass p-8 rounded-2xl ${
                      idx % 2 === 1 ? "md:ml-8" : "md:mr-8"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-poppins font-bold text-slate-900">
                          {exp.position}
                        </h3>
                        <p className={`text-transparent bg-clip-text bg-gradient-to-r ${exp.color} to-transparent font-semibold`}>
                          {exp.company}
                        </p>
                      </div>
                        <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-slate-700">
                          {exp.type}
                        </span>
                      </div>

                    <p className="text-sm text-slate-500 mb-4">{exp.duration}</p>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        Responsibilities:
                      </p>
                      <ul className="space-y-1">
                        {exp.responsibilities.map((resp, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-600 flex gap-2"
                          >
                            <span className="text-blue-500 mt-1">▪</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        Technologies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
