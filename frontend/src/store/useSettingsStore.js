import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SETTINGS = {
  // Theme settings
  theme: 'light',
  isDarkMode: false,
  accentColor: '#0088ff',
  fontFamily: 'Inter', // 'Inter', 'Roboto', 'Poppins'
  fontSize: 'medium', // 'small', 'medium', 'large'
  chatBubbleStyle: 'rounded', // 'rounded', 'square', 'gradient'
  chatBackground: 'default', // 'default', 'pattern1', 'pattern2', 'custom'
  customChatBackground: '',
  
  // Sound settings
  isSoundEnabled: true,
  soundVolume: 0.5,
  soundTheme: 'default', // 'default', 'minimal', 'playful'
  
  // Notification settings
  areNotificationsEnabled: true,
  showNotificationPopup: true,
  
  // Privacy settings
  showOnlineStatus: true,
  showLastSeen: true,
  showReadReceipts: true,
  blurMessagesWhenIdle: false,
  idleTimeout: 5, // minutes
  blockedUsers: [], // array of user IDs
  
  // Profile settings
  profilePicture: '',
  displayName: '',
  status: 'online', // 'online', 'away', 'busy', 'offline'
  bio: '',
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_SETTINGS,

      // Theme actions
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode,
        theme: !state.isDarkMode ? 'dark' : 'light'
      })),
      setAccentColor: (color) => set({ accentColor: color }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setFontSize: (size) => set({ fontSize: size }),
      setChatBubbleStyle: (style) => set({ chatBubbleStyle: style }),
      setChatBackground: (background) => set({ chatBackground: background }),
      setCustomChatBackground: (imageUrl) => set({ 
        chatBackground: 'custom',
        customChatBackground: imageUrl 
      }),

      // Sound & Notification actions
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      setSoundVolume: (volume) => set({ soundVolume: volume }),
      setSoundTheme: (theme) => set({ soundTheme: theme }),
      toggleNotifications: () => set((state) => ({ 
        areNotificationsEnabled: !state.areNotificationsEnabled 
      })),
      toggleNotificationPopup: () => set((state) => ({ 
        showNotificationPopup: !state.showNotificationPopup 
      })),

      // Privacy actions
      toggleOnlineStatus: () => set((state) => ({ showOnlineStatus: !state.showOnlineStatus })),
      toggleLastSeen: () => set((state) => ({ showLastSeen: !state.showLastSeen })),
      toggleReadReceipts: () => set((state) => ({ showReadReceipts: !state.showReadReceipts })),
      toggleBlurMessages: () => set((state) => ({ 
        blurMessagesWhenIdle: !state.blurMessagesWhenIdle 
      })),
      setIdleTimeout: (minutes) => set({ idleTimeout: minutes }),
      blockUser: (userId) => set((state) => ({ 
        blockedUsers: [...state.blockedUsers, userId] 
      })),
      unblockUser: (userId) => set((state) => ({ 
        blockedUsers: state.blockedUsers.filter(id => id !== userId) 
      })),
      clearBlockedUsers: () => set({ blockedUsers: [] }),

      // Profile actions
      updateProfile: (updates) => set((state) => ({
        ...state,
        ...updates,
      })),

      // Chat actions
      clearChatHistory: () => {
        // This would typically clear chat data from localStorage
        localStorage.removeItem('chat-history');
        return true;
      },

      // Account actions
      deleteAccount: () => {
        // Clear all user data from localStorage
        localStorage.clear();
        return true;
      },

      // Reset all settings
      resetSettings: () => set(INITIAL_SETTINGS),
    }),
    {
      name: 'chat-settings',
      // Custom merge function to handle migration of new settings
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);
