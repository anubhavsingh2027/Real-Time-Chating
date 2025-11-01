import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Bell,
  Volume2,
  Eye,
  Lock,
  MessageSquare,
  Download,
  Accessibility,
  Globe,
  Code,
  RotateCcw,
  Search,
  Palette,
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
    appearance: false,
    privacy: false,
    chat: false,
    data: false,
    accessibility: false,
    language: false,
    advanced: false,
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
      <div className="flex-1">
        <label className="text-sm font-medium">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          onClick={onChange}
          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              checked ? "transform translate-x-6" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-500" />
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronDown className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
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
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile picture");
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="text-black dark:text-white p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Settings</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {authUser?.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content with padding for fixed header */}
      <div className="pt-40 pb-32 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
          {/* Profile Section */}
          {filterSections("profile") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
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
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader
                icon={Bell}
                title="Notifications & Sounds"
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
                  <ToggleSwitch
                    checked={settings.notificationPreview}
                    onChange={settings.toggleNotificationPreview}
                    label="Notification Preview"
                    description="Show message preview in notifications"
                  />
                  <ToggleSwitch
                    checked={settings.soundEffects}
                    onChange={settings.toggleSoundEffects}
                    label="Sound Effects"
                    description="Play sound effects for interactions"
                  />
                  <ToggleSwitch
                    checked={settings.messageSound}
                    onChange={settings.toggleMessageSound}
                    label="Message Sound"
                    description="Play sound when receiving messages"
                  />
                  <ToggleSwitch
                    checked={settings.notificationSound}
                    onChange={settings.toggleNotificationSound}
                    label="Notification Sound"
                    description="Play sound for notifications"
                  />
                  <div className="pt-3">
                    <Select
                      label="Keyboard Sound"
                      value={settings.keyboardSound}
                      onChange={(e) => settings.setKeyboardSound(e.target.value)}
                      options={keyboardSoundOptions}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appearance */}
          {filterSections("appearance") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
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

          {/* Privacy */}
          {filterSections("privacy") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader icon={Lock} title="Privacy" section="privacy" />
              {expandedSections.privacy && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.onlineStatus}
                    onChange={settings.toggleOnlineStatus}
                    label="Online Status"
                    description="Show when you're online to others"
                  />
                  <ToggleSwitch
                    checked={settings.lastSeenStatus}
                    onChange={settings.toggleLastSeenStatus}
                    label="Last Seen"
                    description="Show your last seen time"
                  />
                  <ToggleSwitch
                    checked={settings.readReceipts}
                    onChange={settings.toggleReadReceipts}
                    label="Read Receipts"
                    description="Send read receipts when you view messages"
                  />
                  <ToggleSwitch
                    checked={settings.typingIndicator}
                    onChange={settings.toggleTypingIndicator}
                    label="Typing Indicator"
                    description="Show when you're typing"
                  />
                  <div className="pt-3">
                    <Select
                      label="Profile Photo Visibility"
                      value={settings.profilePhotoVisibility}
                      onChange={(e) =>
                        settings.setProfilePhotoVisibility(e.target.value)
                      }
                      options={profilePhotoVisibilityOptions}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Settings */}
          {filterSections("chat") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader
                icon={MessageSquare}
                title="Chat Settings"
                section="chat"
              />
              {expandedSections.chat && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.enterToSend}
                    onChange={settings.toggleEnterToSend}
                    label="Enter to Send"
                    description="Press Enter to send messages (Shift+Enter for new line)"
                  />
                  <ToggleSwitch
                    checked={settings.showTimestamps}
                    onChange={settings.toggleShowTimestamps}
                    label="Show Timestamps"
                    description="Display time on messages"
                  />
                  <ToggleSwitch
                    checked={settings.showMessageStatus}
                    onChange={settings.toggleShowMessageStatus}
                    label="Message Status"
                    description="Show sent, delivered, and read status"
                  />
                  <ToggleSwitch
                    checked={settings.groupMessagesByDate}
                    onChange={settings.toggleGroupMessagesByDate}
                    label="Group Messages by Date"
                    description="Show date separators between messages"
                  />
                  <ToggleSwitch
                    checked={settings.showSenderName}
                    onChange={settings.toggleShowSenderName}
                    label="Show Sender Name"
                    description="Display sender name in group chats"
                  />
                  <ToggleSwitch
                    checked={settings.autoScroll}
                    onChange={settings.toggleAutoScroll}
                    label="Auto-scroll"
                    description="Automatically scroll to new messages"
                  />
                </div>
              )}
            </div>
          )}

          {/* Data & Storage */}
          {filterSections("data") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader
                icon={Download}
                title="Data & Storage"
                section="data"
              />
              {expandedSections.data && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.autoDownloadImages}
                    onChange={settings.toggleAutoDownloadImages}
                    label="Auto-download Images"
                    description="Automatically download and display images"
                  />
                  <ToggleSwitch
                    checked={settings.autoDownloadVideos}
                    onChange={settings.toggleAutoDownloadVideos}
                    label="Auto-download Videos"
                    description="Automatically download videos"
                  />
                  <ToggleSwitch
                    checked={settings.autoDownloadFiles}
                    onChange={settings.toggleAutoDownloadFiles}
                    label="Auto-download Files"
                    description="Automatically download all file types"
                  />
                  <ToggleSwitch
                    checked={settings.compressImages}
                    onChange={settings.toggleCompressImages}
                    label="Compress Images"
                    description="Compress images before sending to save data"
                  />
                  <div className="pt-3">
                    <Select
                      label="Storage Limit"
                      value={settings.storageLimit}
                      onChange={(e) => settings.setStorageLimit(e.target.value)}
                      options={storageLimitOptions}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Accessibility */}
          {filterSections("accessibility") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader
                icon={Accessibility}
                title="Accessibility"
                section="accessibility"
              />
              {expandedSections.accessibility && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.highContrast}
                    onChange={settings.toggleHighContrast}
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                  />
                  <ToggleSwitch
                    checked={settings.reduceMotion}
                    onChange={settings.toggleReduceMotion}
                    label="Reduce Motion"
                    description="Minimize animations for motion sensitivity"
                  />
                  <ToggleSwitch
                    checked={settings.screenReaderOptimized}
                    onChange={settings.toggleScreenReaderOptimized}
                    label="Screen Reader Optimized"
                    description="Optimize interface for screen readers"
                  />
                  <ToggleSwitch
                    checked={settings.keyboardShortcuts}
                    onChange={settings.toggleKeyboardShortcuts}
                    label="Keyboard Shortcuts"
                    description="Enable keyboard shortcuts for navigation"
                  />
                </div>
              )}
            </div>
          )}

          {/* Language & Region */}
          {filterSections("language") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader
                icon={Globe}
                title="Language & Region"
                section="language"
              />
              {expandedSections.language && (
                <div className="p-4 space-y-3">
                  <Select
                    label="Language"
                    value={settings.language}
                    onChange={(e) => settings.setLanguage(e.target.value)}
                    options={languageOptions}
                  />
                  <Select
                    label="Time Format"
                    value={settings.timeFormat}
                    onChange={(e) => settings.setTimeFormat(e.target.value)}
                    options={timeFormatOptions}
                  />
                  <Select
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(e) => settings.setDateFormat(e.target.value)}
                    options={dateFormatOptions}
                  />
                </div>
              )}
            </div>
          )}

          {/* Advanced */}
          {filterSections("advanced") && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
              <SectionHeader icon={Code} title="Advanced" section="advanced" />
              {expandedSections.advanced && (
                <div className="p-4 space-y-1">
                  <ToggleSwitch
                    checked={settings.developerMode}
                    onChange={settings.toggleDeveloperMode}
                    label="Developer Mode"
                    description="Enable advanced developer features"
                  />
                  <ToggleSwitch
                    checked={settings.debugMode}
                    onChange={settings.toggleDebugMode}
                    label="Debug Mode"
                    description="Show debug information and logs"
                  />
                  <ToggleSwitch
                    checked={settings.experimentalFeatures}
                    onChange={settings.toggleExperimentalFeatures}
                    label="Experimental Features"
                    description="Try out new features before they're released"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto p-4 space-y-2">
          <button
            onClick={handleResetSettings}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
