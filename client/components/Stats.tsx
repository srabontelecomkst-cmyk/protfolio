import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Stats = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 50, label: "Projects Completed", symbol: "+" },
    { value: 30, label: "Happy Clients", symbol: "+" },
    { value: 3, label: "Years Experience", symbol: "+" },
    { value: 20, label: "Technologies", symbol: "+" },
  ];

  const Counter = ({ value, inView }: { value: number; inView: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!inView) return;

      let current = 0;
      const increment = value / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(interval);
    }, [inView, value]);

    return <span>{count}</span>;
  };

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">By The Numbers</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A track record of delivering exceptional digital solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl group cursor-pointer"
            >
              <div className="flex items-baseline gap-1 mb-4">
                <div className="text-5xl font-poppins font-bold text-slate-900">
                  <Counter value={stat.value} inView={inView} />
                </div>
                <span className="text-2xl text-blue-600 font-bold">
                  {stat.symbol}
                </span>
              </div>
              <p className="text-slate-700 font-medium">{stat.label}</p>
              <div className="mt-4 h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
