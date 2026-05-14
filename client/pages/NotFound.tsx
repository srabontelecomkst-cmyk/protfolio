import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.documentElement.classList.add("dark");
  }, [location.pathname]);

  return (
    <div className="dark bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] min-h-screen text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50 -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <div className="text-9xl font-poppins font-bold gradient-text">
              404
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            Oops! It seems like you're looking for a page that doesn't exist.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="btn-glow text-white px-8 py-4 text-base font-semibold inline-block"
              >
                Return Home
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="px-8 py-4 rounded-full border-2 border-cyan-500/50 text-white font-semibold hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
