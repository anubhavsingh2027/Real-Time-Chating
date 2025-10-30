import { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';
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
  Palette
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('profile');
  const [tempProfilePic, setTempProfilePic] = useState('');

  // Handle profile picture preview
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
    logout();
    onClose();
  };

  return (
    <div
      className={\`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out \${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }\`}
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
        {['profile', 'theme', 'sound', 'privacy'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`flex-1 p-3 text-sm font-medium transition-colors
              \${activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }\`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={tempProfilePic || profilePicture || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
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
                onChange={(e) => updateProfile({ displayName: e.target.value })}
                placeholder="Display Name"
                className="mt-4 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-white">Theme Mode</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setTheme('light')}
                  className={\`p-3 rounded-lg flex items-center space-x-2 \${
                    theme === 'light' && !enableSystemTheme ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                  }\`}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={\`p-3 rounded-lg flex items-center space-x-2 \${
                    theme === 'dark' && !enableSystemTheme ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                  }\`}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={toggleSystemTheme}
                  className={\`p-3 rounded-lg flex items-center space-x-2 \${
                    enableSystemTheme ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                  }\`}
                >
                  <Monitor className="w-5 h-5" />
                  <span>Auto</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-white">Chat Bubble Style</h3>
              <div className="flex space-x-4">
                {['rounded', 'square', 'gradient'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setChatBubbleStyle(style)}
                    className={\`p-3 rounded-lg flex items-center space-x-2 \${
                      chatBubbleStyle === style ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }\`}
                  >
                    {style === 'rounded' ? <Circle className="w-5 h-5" /> :
                     style === 'square' ? <Square className="w-5 h-5" /> :
                     <Palette className="w-5 h-5" />}
                    <span>{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-white">Background</h3>
              <div className="grid grid-cols-3 gap-4">
                {['default', 'pattern1', 'pattern2', 'color1', 'color2'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setBackground(bg)}
                    className={\`p-3 rounded-lg \${
                      background === bg ? 'ring-2 ring-blue-500' : ''
                    } \${
                      bg === 'default' ? 'bg-gray-100 dark:bg-gray-700' :
                      bg === 'pattern1' ? 'bg-gradient-to-r from-blue-100 to-purple-100' :
                      bg === 'pattern2' ? 'bg-gradient-to-r from-green-100 to-blue-100' :
                      bg === 'color1' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }\`}
                  >
                    {bg.charAt(0).toUpperCase() + bg.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sound Settings */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 dark:text-white" />
                <span className="dark:text-white">Notification Sound</span>
              </div>
              <button
                onClick={toggleSound}
                className={\`w-11 h-6 rounded-full \${
                  isSoundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                } relative transition-colors duration-200\`}
              >
                <span
                  className={\`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 \${
                    isSoundEnabled ? 'right-1' : 'left-1'
                  }\`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-white">Sound Theme</h3>
              <div className="space-y-2">
                {['default', 'minimal', 'playful'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSoundTheme(theme)}
                    className={\`w-full p-3 rounded-lg flex items-center justify-between \${
                      soundTheme === theme ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }\`}
                  >
                    <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    {soundTheme === theme && <Bell className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 dark:text-white" />
                <span className="dark:text-white">Show Online Status</span>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className={\`w-11 h-6 rounded-full \${
                  showOnlineStatus ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                } relative transition-colors duration-200\`}
              >
                <span
                  className={\`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 \${
                    showOnlineStatus ? 'right-1' : 'left-1'
                  }\`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 dark:text-white" />
                <span className="dark:text-white">Blur Messages When Idle</span>
              </div>
              <button
                onClick={toggleBlurMessages}
                className={\`w-11 h-6 rounded-full \${
                  blurMessagesWhenIdle ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                } relative transition-colors duration-200\`}
              >
                <span
                  className={\`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 \${
                    blurMessagesWhenIdle ? 'right-1' : 'left-1'
                  }\`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
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
    </div>
  );
};

export default SettingsPanel;
