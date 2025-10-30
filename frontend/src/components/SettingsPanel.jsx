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
  MessageSquare,
  Lock,
  Check,
  X,
  Clock
} from 'lucide-react';

function SettingsPanel({ onClose, isMobile }) {
  const {
    theme,
    enableSystemTheme,
    enableNotifications,
    enableSoundEffects,
    messagePreview,
    enableReadReceipts,
    enableTypingIndicator,
    onlineStatus,
    lastSeen,
    setTheme,
    setEnableSystemTheme,
    setNotificationSettings,
    setChatSettings,
    setPrivacySettings,
  } = useSettingsStore();

  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Sun className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat Settings', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock className="w-5 h-5" /> },
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 h-full flex flex-col ${isMobile ? 'w-full' : 'w-[400px]'}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt={authUser?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">
              {authUser?.fullName}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {authUser?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 flex flex-col items-center gap-1
              ${activeTab === tab.id
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-slate-600 dark:text-slate-400'
              }`}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                Theme
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5" />
                    <span>Use system theme</span>
                  </div>
                  <button
                    onClick={() => setEnableSystemTheme(!enableSystemTheme)}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      enableSystemTheme ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      enableSystemTheme ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
                
                {!enableSystemTheme && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 p-3 rounded-lg border ${
                        theme === 'light'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Sun className="w-5 h-5 mx-auto" />
                      <span className="text-sm mt-1 block">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 p-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Moon className="w-5 h-5 mx-auto" />
                      <span className="text-sm mt-1 block">Dark</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span>Enable notifications</span>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({ enableNotifications: !enableNotifications })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      enableNotifications ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      enableNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5" />
                    <span>Sound effects</span>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({ enableSoundEffects: !enableSoundEffects })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      enableSoundEffects ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      enableSoundEffects ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span>Message preview</span>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({ messagePreview: !messagePreview })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      messagePreview ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      messagePreview ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>
          )}

          {/* Chat Settings */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Read receipts</span>
                  </div>
                  <button
                    onClick={() => setChatSettings({ enableReadReceipts: !enableReadReceipts })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      enableReadReceipts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      enableReadReceipts ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>Typing indicator</span>
                  </div>
                  <button
                    onClick={() => setChatSettings({ enableTypingIndicator: !enableTypingIndicator })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      enableTypingIndicator ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      enableTypingIndicator ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Show online status</span>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ onlineStatus: !onlineStatus })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      onlineStatus ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      onlineStatus ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <span>Show last seen</span>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ lastSeen: !lastSeen })}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      lastSeen ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
                      lastSeen ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;