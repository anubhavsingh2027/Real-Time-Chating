import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-3xl mx-auto">
        {/* Main container for 404 content */}
        <div className="text-center space-y-8">
          {/* Animated 404 Text */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[150px] font-black text-white leading-none relative z-10">
              <motion.span
                className="inline-block"
                animate={{
                  x: [-2, 2, -2],
                  color: ["#FF0080", "#7928CA", "#FF0080"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                4
              </motion.span>
              <motion.span
                className="inline-block"
                animate={{
                  y: [-2, 2, -2],
                  color: ["#7928CA", "#FF0080", "#7928CA"],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                0
              </motion.span>
              <motion.span
                className="inline-block"
                animate={{
                  x: [2, -2, 2],
                  color: ["#FF0080", "#7928CA", "#FF0080"],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                4
              </motion.span>
            </h1>
            {/* Background glow effect */}
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-pink-500 to-purple-500" />
          </motion.div>

          {/* Animated description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Animated button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-1 bg-white rounded-full"
              initial={{
                opacity: Math.random(),
                scale: Math.random(),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * -window.innerHeight],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;