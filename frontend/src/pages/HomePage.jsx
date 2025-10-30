import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import SettingsPanel from '../components/SettingsPanel';
import { useSettingsStore } from '../store/useSettingsStore';

const HomePage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settings = useSettingsStore();

  // Handle theme changes
  useEffect(() => {
    const theme = settings.settings.theme;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [settings.settings.theme]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
      {/* Logo and App Name */}
      <div className="text-center mb-8">
        <motion.img
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/logo.png"
          alt="ChatZen Logo"
          className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-lg"
        />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 dark:text-white"
        >
          ChatZen
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300 mt-2"
        >
          Modern, Minimal, Meaningful
        </motion.p>
      </div>

      {/* Settings Button */}
      <motion.button
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        whileHover={{ rotate: 90 }}
      >
        <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </motion.button>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Glassmorphism Background Elements */}
      {settings.settings.useAnimations && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-8 left-40 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;