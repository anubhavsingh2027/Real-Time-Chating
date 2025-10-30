import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Eye,
  LogOut,
  RotateCcw,
  X,
  Upload,
  Square,
  Circle,
  Palette,
  User,
} from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useAuthStore } from "../store/useAuthStore";

// 🔘 Reusable Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 rounded-full ${
      checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
    } relative transition-colors duration-200`}
  >
    <span
      className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 ${
        checked ? "right-1" : "left-1"
      }`}
    />
  </button>
);

const SettingsPanel = ({ isOpen, onClose }) => {
  const {
    theme,
    enableSystemTheme,
    chatBubbleStyle,
    background,
    isSoundEnabled,
    soundTheme,
    showOnlineStatus,
    blurMessagesWhenIdle,
    profilePicture,
    displayName,
    setTheme,
    toggleSystemTheme,
    setChatBubbleStyle,
    setBackground,
    toggleSound,
    setSoundTheme,
    toggleOnlineStatus,
    toggleBlurMessages,
    updateProfile,
    resetSettings,
  } = useSettingsStore();

  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [tempProfilePic, setTempProfilePic] = useState("");

  // 🔊 Play sample sound when changing theme
  const handleSoundThemeChange = (theme) => {
    setSoundTheme(theme);
    const audio = new Audio(`/sounds/${theme}.mp3`);
    audio.play().catch(() => {});
  };

  // 🧠 Keep dark/light mode synced to HTML root
  useEffect(() => {
    if (enableSystemTheme) {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, enableSystemTheme]);

  // 🖼 Handle profile picture preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result);
        updateProfile({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
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

          {/* Settings Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700">
              {["profile", "theme", "sound", "privacy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 p-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={
                          tempProfilePic ||
                          profilePicture ||
                          "https://via.placeholder.com/100"
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                      <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                        <Upload className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) =>
                        updateProfile({ displayName: e.target.value })
                      }
                      placeholder="Display Name"
                      className="mt-4 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full text-center"
                    />
                  </div>
                </div>
              )}

              {/* Theme */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  {/* Mode */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium dark:text-white">
                      Theme Mode
                    </h3>
                    <div className="flex space-x-3">
                      {[
                        { label: "Light", icon: Sun, fn: () => setTheme("light") },
                        { label: "Dark", icon: Moon, fn: () => setTheme("dark") },
                        {
                          label: "System",
                          icon: Monitor,
                          fn: toggleSystemTheme,
                        },
                      ].map(({ label, icon: Icon, fn }) => (
                        <button
                          key={label}
                          onClick={fn}
                          className={`p-3 rounded-lg flex items-center space-x-2 ${
                            (theme === label.toLowerCase() &&
                              !enableSystemTheme) ||
                            (enableSystemTheme && label === "System")
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bubble Style */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium dark:text-white">
                      Chat Bubble Style
                    </h3>
                    <div className="flex space-x-3">
                      {["rounded", "square", "gradient"].map((style) => {
                        const Icon =
                          style === "rounded"
                            ? Circle
                            : style === "square"
                            ? Square
                            : Palette;
                        return (
                          <button
                            key={style}
                            onClick={() => setChatBubbleStyle(style)}
                            className={`p-3 rounded-lg flex items-center space-x-2 ${
                              chatBubbleStyle === style
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Preview */}
                    <div className="mt-4 p-3 rounded-lg border dark:border-gray-700">
                      <div
                        className={`p-2 ${
                          chatBubbleStyle === "gradient"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        } rounded-lg w-fit`}
                      >
                        Sample message bubble
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound */}
              {activeTab === "sound" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">
                        Notification Sound
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={isSoundEnabled}
                      onChange={toggleSound}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium dark:text-white">
                      Sound Theme
                    </h3>
                    {["default", "minimal", "playful"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleSoundThemeChange(theme)}
                        className={`w-full p-3 rounded-lg flex items-center justify-between ${
                          soundTheme === theme
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <span>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </span>
                        {soundTheme === theme && <Bell className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">
                        Show Online Status
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={showOnlineStatus}
                      onChange={toggleOnlineStatus}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 dark:text-white" />
                      <span className="dark:text-white">
                        Blur Messages When Idle
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={blurMessagesWhenIdle}
                      onChange={toggleBlurMessages}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex space-x-4">
                <button
                  onClick={resetSettings}
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
