import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  messageStatuses: {}, // tracks status of each message
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser, socket } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Update UI immediately
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const actualMessage = res.data;

      // Update messages, replacing optimistic with actual
      set(state => ({
        messages: state.messages.map(msg =>
          msg._id === tempId ? actualMessage : msg
        )
      }));

      // Emit the message through socket for real-time update
      if (socket) {
        socket.emit('newMessage', {
          message: actualMessage,
          receiverId: selectedUser._id
        });
      }
    } catch (error) {
      // Remove optimistic message on failure
      set(state => ({
        messages: state.messages.filter(msg => msg._id !== tempId)
      }));

      const errorMsg = error.response?.data?.message || "Error sending message. Please try again.";
      toast.error(errorMsg);

      if (errorMsg.includes("10 MB")) {
        setTimeout(() => {
          window.location.href='/'
        }, 2000);
      }
    }
  },

  updateMessageStatus: (messageId, status) => {
    set(state => ({
      messageStatuses: {
        ...state.messageStatuses,
        [messageId]: status
      }
    }));
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove any existing listeners
    socket.off("newMessage");

    // Add new message listener
    // Listen for message status updates
    socket.on("messageStatus", ({ messageId, status }) => {
      get().updateMessageStatus(messageId, status);
    });

    // Listen for new messages
    socket.on("newMessage", (data) => {
      const newMessage = data.message || data;
      const { authUser } = useAuthStore.getState();

      // Only process messages relevant to the current chat
      const isRelevantMessage =
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);

      if (!isRelevantMessage) return;

      set(state => {
        // Check for duplicates
        const messageExists = state.messages.some(msg =>
          msg._id === newMessage._id ||
          (msg.isOptimistic && msg.text === newMessage.text && msg.createdAt === newMessage.createdAt)
        );

        if (messageExists) return state;

        // Play sound for incoming messages from other users
        if (isSoundEnabled && newMessage.senderId === selectedUser._id) {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound.currentTime = 0;
          notificationSound.play().catch(() => {});
        }

        return {
          messages: [...state.messages, newMessage]
        };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageStatus");
  },
}));

export default useChatStore;
