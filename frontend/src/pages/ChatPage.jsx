import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open on mobile

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedUser(chat);
    setSidebarOpen(false); // Close sidebar when chat is selected on mobile
  };

  // Handle back button (mobile)
  const handleBack = () => {
    setSelectedUser(null);
    setSidebarOpen(true);
  };

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      {/* Mobile view with two panels */}
      <div className="lg:hidden h-full">
        {/* Chats List Panel (full width on mobile) */}
        <div
          className={`fixed inset-0 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
            !selectedUser || isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? (
                <ChatsList onSelectChat={handleChatSelect} />
              ) : (
                <ContactList onSelectContact={handleChatSelect} />
              )}
            </div>
          </div>
        </div>

        {/* Chat Panel (full width on mobile) */}
        {selectedUser && (
          <div
            className={`fixed inset-0 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
              !isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
              <ChatContainer onOpenSidebar={handleBack} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop layout with BorderAnimatedContainer */}
      <div className="hidden lg:block h-full">
        <BorderAnimatedContainer>
          {/* LEFT SIDE - always visible on desktop */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? (
                <ChatsList onSelectChat={(chat) => setSelectedUser(chat)} />
              ) : (
                <ContactList onSelectContact={(contact) => setSelectedUser(contact)} />
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? (
              <ChatContainer />
            ) : (
              <NoConversationPlaceholder />
            )}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ChatPage;
