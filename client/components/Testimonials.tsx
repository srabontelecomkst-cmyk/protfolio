import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getTestimonials, type Testimonial } from "@/lib/admin-data";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getTestimonials());

  useEffect(() => {
    setTestimonials(getTestimonials());
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (testimonials.length === 0) {
        return 0;
      }
      return (prev + 1) % testimonials.length;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (testimonials.length === 0) {
        return 0;
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">Testimonials</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * 100 + "%" }}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    whileInView={{ opacity: 1 }}
                    className="glass p-8 md:p-12 rounded-2xl mx-auto max-w-2xl"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-lg text-slate-700 mb-8 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-slate-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-900 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  animate={{
                    width: currentIndex === idx ? 32 : 8,
                    backgroundColor:
                      currentIndex === idx
                        ? "rgb(124, 58, 237)"
                        : "rgb(107, 114, 128)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full transition-all duration-300"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-900 hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
