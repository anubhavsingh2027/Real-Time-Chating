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
  const { activeTab, selectedUser } = useChatStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      {/* Mobile sidebar overlay - full width on mobile, hidden on desktop */}
      <div
        className={`fixed inset-0 bg-slate-900 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
          <ProfileHeader onClose={() => setSidebarOpen(false)} showBackButton />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList onSelectChat={() => setSidebarOpen(false)} /> : <ContactList onSelectContact={() => setSidebarOpen(false)} />}
          </div>
        </div>
      </div>

      {/* Desktop layout with BorderAnimatedContainer */}
      <BorderAnimatedContainer>
        {/* LEFT SIDE - visible only on desktop */}
        <div className="hidden lg:flex lg:w-80 bg-slate-800/50 backdrop-blur-sm flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? (
            <ChatContainer onOpenSidebar={() => setSidebarOpen(true)} />
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
