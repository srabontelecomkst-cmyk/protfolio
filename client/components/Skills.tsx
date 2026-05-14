import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSkills, type SkillCategory } from "@/lib/admin-data";

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => getSkills());

  useEffect(() => {
    setSkillCategories(getSkills());
  }, []);

  const allTechs = Array.from(
    new Set(skillCategories.flatMap((category) => category.skills.map((skill) => skill.name)))
  );

  return (
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">Skills &amp; Technologies</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Expertise across the full development stack
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {skillCategories.map((category, categoryIdx) => (
            <motion.div
              key={categoryIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIdx * 0.1 }}
              className="glass p-8 rounded-2xl"
            >
              <h3 className="text-xl font-poppins font-bold text-slate-900 mb-6">
                {category.title}
              </h3>

              <div className="space-y-6">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {skill.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {skill.level}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: skillIdx * 0.1 }}
                      className="h-2 rounded-full bg-slate-200 overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{
                          duration: 1.2,
                          delay: skillIdx * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-2xl overflow-hidden"
        >
          <h3 className="text-xl font-poppins font-bold text-slate-900 mb-8 text-center">
            All Technologies
          </h3>

          <div className="relative flex overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="flex gap-4 whitespace-nowrap"
            >
              {[...allTechs, ...allTechs].map((tech, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 rounded-full bg-blue-50 border border-blue-100 hover:border-blue-300 transition-colors text-sm font-medium text-slate-700 hover:text-blue-700 flex-shrink-0"
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
