import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "asifkst20242300@gmail.com",
      href: "mailto:asifkst20242300@gmail.com",
      color: "from-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "01331707900",
      href: "tel:01331707900",
      color: "from-blue-500",
    },
    {
      icon: MessageSquare,
      label: "WhatsApp",
      value: "Message me anytime",
      href: "https://wa.me/8801331707900",
      color: "from-green-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Bangladesh",
      href: "#",
      color: "from-purple-500",
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-slate-900">Get In Touch</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Let's discuss your project and how I can help bring your vision to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {contactMethods.map((method, idx) => (
              <motion.a
                key={idx}
                href={method.href}
                whileHover={{ x: 10 }}
                className="glass p-6 rounded-2xl group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                 <div
                   className={`p-4 rounded-xl bg-gradient-to-br ${method.color} to-transparent transition-all duration-300 group-hover:opacity-30`}
                 >
                   <method.icon className="w-6 h-6 text-blue-600" />
                 </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-slate-900 mb-1">
                      {method.label}
                    </h4>
                    <p className="text-slate-600 text-sm">{method.value}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass p-6 rounded-2xl h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-50" />
                <p className="text-slate-500">Based in Bangladesh</p>
                <p className="text-sm text-slate-500 mt-2">
                  Available for remote work worldwide
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-8 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project subject"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all duration-300 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-glow text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </motion.button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm"
                >
                  ✓ Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
