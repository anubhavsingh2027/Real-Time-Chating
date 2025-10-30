import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Theme settings
      theme: 'dark',
      enableSystemTheme: true,
      
      // Notification settings
      enableNotifications: true,
      enableSoundEffects: true,
      messagePreview: true,
      
      // Chat settings
      enableReadReceipts: true,
      enableTypingIndicator: true,
      
      // Privacy settings
      onlineStatus: true,
      lastSeen: true,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      setEnableSystemTheme: (enable) => set({ enableSystemTheme: enable }),
      setNotificationSettings: (settings) => set((state) => ({
        enableNotifications: settings.enableNotifications ?? state.enableNotifications,
        enableSoundEffects: settings.enableSoundEffects ?? state.enableSoundEffects,
        messagePreview: settings.messagePreview ?? state.messagePreview,
      })),
      setChatSettings: (settings) => set((state) => ({
        enableReadReceipts: settings.enableReadReceipts ?? state.enableReadReceipts,
        enableTypingIndicator: settings.enableTypingIndicator ?? state.enableTypingIndicator,
      })),
      setPrivacySettings: (settings) => set((state) => ({
        onlineStatus: settings.onlineStatus ?? state.onlineStatus,
        lastSeen: settings.lastSeen ?? state.lastSeen,
      })),
    }),
    {
      name: 'chat-settings',
    }
  )
);