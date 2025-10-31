import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    (set) => ({
      // Sound & Notifications
      soundEffects: true,
      toggleSoundEffects: () =>
        set((state) => ({ soundEffects: !state.soundEffects })),
      notifications: true,
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
      keyboardSound: "keystroke1",
      setKeyboardSound: (sound) => set({ keyboardSound: sound }),
      messageSound: true,
      toggleMessageSound: () =>
        set((state) => ({ messageSound: !state.messageSound })),
      notificationSound: true,
      toggleNotificationSound: () =>
        set((state) => ({ notificationSound: !state.notificationSound })),
      desktopNotifications: true,
      toggleDesktopNotifications: () =>
        set((state) => ({ desktopNotifications: !state.desktopNotifications })),
      notificationPreview: true,
      toggleNotificationPreview: () =>
        set((state) => ({ notificationPreview: !state.notificationPreview })),

      // Appearance
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      fontSize: "medium",
      setFontSize: (size) => set({ fontSize: size }),
      messageDensity: "comfortable",
      setMessageDensity: (density) => set({ messageDensity: density }),
      animations: true,
      toggleAnimations: () =>
        set((state) => ({ animations: !state.animations })),
      chatBackground: "default",
      setChatBackground: (background) => set({ chatBackground: background }),
      bubbleStyle: "rounded",
      setBubbleStyle: (style) => set({ bubbleStyle: style }),

      // Privacy
      onlineStatus: true,
      toggleOnlineStatus: () =>
        set((state) => ({ onlineStatus: !state.onlineStatus })),
      readReceipts: true,
      toggleReadReceipts: () =>
        set((state) => ({ readReceipts: !state.readReceipts })),
      typingIndicator: true,
      toggleTypingIndicator: () =>
        set((state) => ({ typingIndicator: !state.typingIndicator })),
      lastSeenStatus: true,
      toggleLastSeenStatus: () =>
        set((state) => ({ lastSeenStatus: !state.lastSeenStatus })),
      profilePhotoVisibility: "everyone",
      setProfilePhotoVisibility: (visibility) =>
        set({ profilePhotoVisibility: visibility }),

      // Chat Settings
      enterToSend: true,
      toggleEnterToSend: () =>
        set((state) => ({ enterToSend: !state.enterToSend })),
      showTimestamps: true,
      toggleShowTimestamps: () =>
        set((state) => ({ showTimestamps: !state.showTimestamps })),
      autoScroll: true,
      toggleAutoScroll: () =>
        set((state) => ({ autoScroll: !state.autoScroll })),
      showMessageStatus: true,
      toggleShowMessageStatus: () =>
        set((state) => ({ showMessageStatus: !state.showMessageStatus })),
      groupMessagesByDate: true,
      toggleGroupMessagesByDate: () =>
        set((state) => ({ groupMessagesByDate: !state.groupMessagesByDate })),
      showSenderName: true,
      toggleShowSenderName: () =>
        set((state) => ({ showSenderName: !state.showSenderName })),

      // Data & Storage
      autoDownloadImages: true,
      toggleAutoDownloadImages: () =>
        set((state) => ({ autoDownloadImages: !state.autoDownloadImages })),
      autoDownloadVideos: false,
      toggleAutoDownloadVideos: () =>
        set((state) => ({ autoDownloadVideos: !state.autoDownloadVideos })),
      autoDownloadFiles: false,
      toggleAutoDownloadFiles: () =>
        set((state) => ({ autoDownloadFiles: !state.autoDownloadFiles })),
      compressImages: true,
      toggleCompressImages: () =>
        set((state) => ({ compressImages: !state.compressImages })),
      storageLimit: "1GB",
      setStorageLimit: (limit) => set({ storageLimit: limit }),

      // Accessibility
      highContrast: false,
      toggleHighContrast: () =>
        set((state) => ({ highContrast: !state.highContrast })),
      reduceMotion: false,
      toggleReduceMotion: () =>
        set((state) => ({ reduceMotion: !state.reduceMotion })),
      screenReaderOptimized: false,
      toggleScreenReaderOptimized: () =>
        set((state) => ({
          screenReaderOptimized: !state.screenReaderOptimized,
        })),
      keyboardShortcuts: true,
      toggleKeyboardShortcuts: () =>
        set((state) => ({ keyboardShortcuts: !state.keyboardShortcuts })),

      // Language & Region
      language: "english",
      setLanguage: (lang) => set({ language: lang }),
      timeFormat: "12h",
      setTimeFormat: (format) => set({ timeFormat: format }),
      dateFormat: "MM/DD/YYYY",
      setDateFormat: (format) => set({ dateFormat: format }),

      // Advanced
      developerMode: false,
      toggleDeveloperMode: () =>
        set((state) => ({ developerMode: !state.developerMode })),
      debugMode: false,
      toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
      experimentalFeatures: false,
      toggleExperimentalFeatures: () =>
        set((state) => ({
          experimentalFeatures: !state.experimentalFeatures,
        })),

      // Reset all settings
      resetSettings: () =>
        set({
          soundEffects: true,
          notifications: true,
          keyboardSound: "keystroke1",
          messageSound: true,
          notificationSound: true,
          desktopNotifications: true,
          notificationPreview: true,
          theme: "dark",
          fontSize: "medium",
          messageDensity: "comfortable",
          animations: true,
          chatBackground: "default",
          bubbleStyle: "rounded",
          onlineStatus: true,
          readReceipts: true,
          typingIndicator: true,
          lastSeenStatus: true,
          profilePhotoVisibility: "everyone",
          enterToSend: true,
          showTimestamps: true,
          autoScroll: true,
          showMessageStatus: true,
          groupMessagesByDate: true,
          showSenderName: true,
          autoDownloadImages: true,
          autoDownloadVideos: false,
          autoDownloadFiles: false,
          compressImages: true,
          storageLimit: "1GB",
          highContrast: false,
          reduceMotion: false,
          screenReaderOptimized: false,
          keyboardShortcuts: true,
          language: "english",
          timeFormat: "12h",
          dateFormat: "MM/DD/YYYY",
          developerMode: false,
          debugMode: false,
          experimentalFeatures: false,
        }),
    }),
    {
      name: "chat-settings-storage",
    }
  )
);

export default useSettingsStore;
