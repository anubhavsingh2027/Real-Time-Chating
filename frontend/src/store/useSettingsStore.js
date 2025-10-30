import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SETTINGS = {
  // Theme settings
  theme: 'dark',
  enableSystemTheme: true,
  chatBubbleStyle: 'rounded', // 'rounded', 'square', 'gradient'
  background: 'default', // 'default', 'pattern1', 'pattern2', 'color1', etc.
  
  // Sound settings
  isSoundEnabled: true,
  soundTheme: 'default', // 'default', 'minimal', 'playful'
  
  // Privacy settings
  showOnlineStatus: true,
  blurMessagesWhenIdle: false,
  idleTimeout: 5, // minutes
  
  // Profile settings (UI only)
  profilePicture: '',
  displayName: '',
  status: 'online', // 'online', 'offline'
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...INITIAL_SETTINGS,

      // Theme actions
      setTheme: (theme) => set({ theme }),
      toggleSystemTheme: () => set((state) => ({ enableSystemTheme: !state.enableSystemTheme })),
      setChatBubbleStyle: (style) => set({ chatBubbleStyle: style }),
      setBackground: (background) => set({ background }),

      // Sound actions
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      setSoundTheme: (theme) => set({ soundTheme: theme }),

      // Privacy actions
      toggleOnlineStatus: () => set((state) => ({ showOnlineStatus: !state.showOnlineStatus })),
      toggleBlurMessages: () => set((state) => ({ blurMessagesWhenIdle: !state.blurMessagesWhenIdle })),
      setIdleTimeout: (minutes) => set({ idleTimeout: minutes }),

      // Profile actions
      updateProfile: (updates) => set((state) => ({
        ...state,
        ...updates,
      })),

      // Reset settings
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
