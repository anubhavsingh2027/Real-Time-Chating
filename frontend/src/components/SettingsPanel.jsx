import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Eye,
  User,
  LogOut,
  RotateCcw,
  X,
  Upload,
  Square,
  Circle,
  Palette,
  MessageCircle,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';

// App branding constants
const APP_NAME = "ChatZen";
const APP_LOGO = "/logo.png";
const APP_VERSION = "1.0.0";

// Reusable Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 rounded-full ${
      checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
    } relative transition-colors duration-200`}
  >
    <span
      className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 ${
        checked ? 'right-1' : 'left-1'
      }`}
    />
  </button>
);

const SettingsPanel = ({ isOpen, onClose }) => {
  const settings = useSettingsStore();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [tempProfilePic, setTempProfilePic] = useState('');

  // Available tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'theme', label: 'Theme', icon: settings.isDarkMode ? Moon : Sun },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'about', label: 'About', icon: Info }
  ];

  // Handle sound theme changes with preview
  const handleSoundThemeChange = (theme) => {
    settings.setSoundTheme(theme);
    const audio = new Audio(`/sounds/${theme}-preview.mp3`);
    audio.play().catch(() => {});
  };

  // Keep dark/light mode synced to HTML root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.isDarkMode);
  }, [settings.isDarkMode]);

  // Handle profile picture changes
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result);
        settings.updateProfile({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img src={APP_LOGO} alt="Logo" className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">{APP_NAME}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 p-4 border-b dark:border-gray-700 overflow-x-auto">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={tempProfilePic || settings.profilePicture || 'https://via.placeholder.com/100'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 shadow-lg">
                        <Upload className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                        />
                      </label>
                    </div>
                    <div className="mt-4 space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={settings.displayName}
                          onChange={(e) => settings.updateProfile({ displayName: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          value={settings.status}
                          onChange={(e) => settings.updateProfile({ status: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="online">Online</option>
                          <option value="away">Away</option>
                          <option value="busy">Busy</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={settings.bio}
                          onChange={(e) => settings.updateProfile({ bio: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-white">Theme</h3>
                    <div className="flex items-center justify-between">
                      <span className="dark:text-white">Dark Mode</span>
                      <ToggleSwitch
                        checked={settings.isDarkMode}
                        onChange={settings.toggleDarkMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-white">Chat Bubble Style</h3>
                    <div className="flex space-x-4">
                      {['rounded', 'square', 'gradient'].map(style => (
                        <button
                          key={style}
                          onClick={() => settings.setChatBubbleStyle(style)}
                          className={`flex-1 p-3 rounded-lg border dark:border-gray-700 ${
                            settings.chatBubbleStyle === style
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sound */}
              {activeTab === 'sound' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="dark:text-white">Enable Sounds</span>
                    <ToggleSwitch
                      checked={settings.isSoundEnabled}
                      onChange={settings.toggleSound}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Volume
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.volume}
                      onChange={(e) => settings.setVolume(parseFloat(e.target.value))}
                      className="w-full"
                      disabled={!settings.isSoundEnabled}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-white">Sound Theme</h3>
                    <div className="space-y-2">
                      {['default', 'minimal', 'playful'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSoundThemeChange(theme)}
                          className={`w-full p-3 rounded-lg flex items-center justify-between ${
                            settings.soundTheme === theme
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                          {settings.soundTheme === theme && <Bell className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">Show Online Status</span>
                    </div>
                    <ToggleSwitch
                      checked={settings.showOnlineStatus}
                      onChange={settings.toggleOnlineStatus}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">Show Read Receipts</span>
                    </div>
                    <ToggleSwitch
                      checked={settings.showReadReceipts}
                      onChange={settings.toggleReadReceipts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">Blur Messages When Idle</span>
                    </div>
                    <ToggleSwitch
                      checked={settings.blurMessagesWhenIdle}
                      onChange={settings.toggleBlurMessages}
                    />
                  </div>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <img src={APP_LOGO} alt="Logo" className="w-20 h-20" />
                    <div className="text-center">
                      <h3 className="text-xl font-bold dark:text-white">{APP_NAME}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Version {APP_VERSION}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <span className="dark:text-white">Privacy Policy</span>
                      <HelpCircle className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <span className="dark:text-white">Terms of Service</span>
                      <HelpCircle className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <span className="dark:text-white">Report an Issue</span>
                      <HelpCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex space-x-4">
                <button
                  onClick={settings.resetSettings}
                  className="flex-1 flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center space-x-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;