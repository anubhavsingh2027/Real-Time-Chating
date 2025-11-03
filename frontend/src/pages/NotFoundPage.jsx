import { motion } from 'framer-motion';
import { Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Glitch effect animation for 404 text
  const glitchAnimation = {
    hidden: { skew: 0 },
    visible: {
      skew: [-3, 3, -3, 3, 0],
      x: [-2, 4, -4, 2, 0],
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'hue-rotate(0deg)',
      ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 5,
      },
    },
  };

  // Floating animation for the robot
  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated robot character */}
        <motion.div
          className="mb-8"
          animate={floatingAnimation}
        >
          <motion.div
            className="w-48 h-48 mx-auto relative"
            whileHover={{ scale: 1.1 }}
          >
            {/* Robot face */}
            <div className="absolute inset-0 bg-gray-200 rounded-full shadow-lg">
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              <motion.div
                className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* 404 text with glitch effect */}
        <motion.h1
          className="text-8xl font-bold text-white mb-4"
          variants={glitchAnimation}
          animate="visible"
          style={{ textShadow: '3px 3px 0 rgba(255,0,255,0.5), -3px -3px 0 rgba(0,255,255,0.5)' }}
        >
          404
        </motion.h1>

        {/* Animated text elements */}
        <motion.h2
          className="text-3xl font-semibold text-purple-200 mb-4"
          variants={itemVariants}
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          className="text-lg text-purple-300 mb-8 max-w-md mx-auto"
          variants={itemVariants}
        >
          Looks like you've ventured into unknown territory. Don't worry, our robot friend will help you get back on track!
        </motion.p>

        {/* Action buttons with hover effects */}
        <motion.div
          className="flex gap-4 justify-center"
          variants={itemVariants}
        >
          <Link to="/">
            <motion.button
              className="px-6 py-3 bg-white text-purple-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
          <motion.button
            className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <RefreshCw className="w-5 h-5" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -100],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;