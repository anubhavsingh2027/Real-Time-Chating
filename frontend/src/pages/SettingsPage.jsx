import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Bell,
  Palette,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  Camera,
  User,
  Mail,
} from "lucide-react";
import useSettingsStore from "../store/useSettingsStore";
import { useAuthStore } from "../store/useAuthStore";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Select from "../components/Select";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  const { logout, authUser, updateProfile } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const fileInputRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    notifications: false,
    appearance: false
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const keyboardSoundOptions = [
    { value: "keystroke1", label: "Keystroke 1" },
    { value: "keystroke2", label: "Keystroke 2" },
    { value: "keystroke3", label: "Keystroke 3" },
    { value: "keystroke4", label: "Keystroke 4" },
    { value: "mouse-click", label: "Mouse Click" },
  ];

  const fontSizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "extra-large", label: "Extra Large" },
  ];

  const messageDensityOptions = [
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

  const chatBackgroundOptions = [
    { value: "default", label: "Default" },
    { value: "gradient", label: "Gradient" },
    { value: "pattern", label: "Pattern" },
    { value: "solid", label: "Solid Color" },
  ];

  const bubbleStyleOptions = [
    { value: "rounded", label: "Rounded" },
    { value: "square", label: "Square" },
    { value: "minimal", label: "Minimal" },
  ];

  const profilePhotoVisibilityOptions = [
    { value: "everyone", label: "Everyone" },
    { value: "contacts", label: "My Contacts" },
    { value: "nobody", label: "Nobody" },
  ];

  const storageLimitOptions = [
    { value: "500MB", label: "500 MB" },
    { value: "1GB", label: "1 GB" },
    { value: "2GB", label: "2 GB" },
    { value: "5GB", label: "5 GB" },
    { value: "unlimited", label: "Unlimited" },
  ];

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "hindi", label: "Hindi" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
  ];

  const timeFormatOptions = [
    { value: "12h", label: "12 Hour" },
    { value: "24h", label: "24 Hour" },
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1 pr-4">
        <label className="text-sm font-medium cursor-pointer select-none">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          id={`toggle-${label}`}
        />
        <label
          htmlFor={`toggle-${label}`}
          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              checked ? "transform translate-x-6" : ""
            }`}
          />
        </label>
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      settings.resetSettings();
      toast.success("Settings reset to defaults");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUpdatingProfile(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateProfile({ profilePic: reader.result });
        
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error(error.response?.data?.message || "Failed to update profile picture");
      } finally {
        setIsUpdatingProfile(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filterSections = (sectionName) => {
    if (!searchQuery) return true;
    return sectionName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="text-black dark:text-white p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors relative z-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Settings</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    {authUser?.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 pb-32">
        {/* Settings sections in a responsive grid */}
        <div className="w-full mx-auto space-y-4 sm:space-y-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Profile Section */}
          {filterSections("profile") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <SectionHeader
                icon={User}
                title="Profile"
                section="profile"
              />
              {expandedSections.profile && (
                <div className="p-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500">
                        {authUser?.profilePic ? (
                          <img
                            src={authUser.profilePic}
                            alt={authUser.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                            {authUser?.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUpdatingProfile}
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingProfile ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Click camera icon to change profile picture
                    </p>
                  </div>

                  {/* Profile Information */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <p className="text-base font-semibold text-black dark:text-white">
                          {authUser?.fullName}
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <p className="text-base text-black dark:text-white">
                          {authUser?.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Member Since
                      </label>
                      <p className="text-base text-black dark:text-white mt-2">
                        {new Date(authUser?.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications & Sounds */}
          {filterSections("notifications") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <SectionHeader
                icon={Bell}
                title="Notifications"
                section="notifications"
              />
              {expandedSections.notifications && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.notifications}
                    onChange={settings.toggleNotifications}
                    label="Enable Notifications"
                    description="Receive notifications for new messages"
                  />
                  <ToggleSwitch
                    checked={settings.desktopNotifications}
                    onChange={settings.toggleDesktopNotifications}
                    label="Desktop Notifications"
                    description="Show notifications on your desktop"
                  />
                </div>
              )}
            </div>
          )}

          {/* Appearance */}
          {filterSections("appearance") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <SectionHeader
                icon={Palette}
                title="Appearance"
                section="appearance"
              />
              {expandedSections.appearance && (
                <div className="p-4 space-y-1">
                  <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                    <ThemeSwitcher />
                  </div>
                  <Select
                    label="Font Size"
                    value={settings.fontSize}
                    onChange={(e) => settings.setFontSize(e.target.value)}
                    options={fontSizeOptions}
                  />
                  <Select
                    label="Message Density"
                    value={settings.messageDensity}
                    onChange={(e) => settings.setMessageDensity(e.target.value)}
                    options={messageDensityOptions}
                  />
                  <Select
                    label="Chat Background"
                    value={settings.chatBackground}
                    onChange={(e) => settings.setChatBackground(e.target.value)}
                    options={chatBackgroundOptions}
                  />
                  <Select
                    label="Bubble Style"
                    value={settings.bubbleStyle}
                    onChange={(e) => settings.setBubbleStyle(e.target.value)}
                    options={bubbleStyleOptions}
                  />
                  <ToggleSwitch
                    checked={settings.animations}
                    onChange={settings.toggleAnimations}
                    label="Animations"
                    description="Enable smooth animations and transitions"
                  />
                </div>
              )}
            </div>
          )}

          {/* Data & Storage removed */}

          {/* Accessibility removed */}

          {/* Language & Region removed */}

          {/* Advanced removed */}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-30">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleResetSettings}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              Reset to Defaults
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
