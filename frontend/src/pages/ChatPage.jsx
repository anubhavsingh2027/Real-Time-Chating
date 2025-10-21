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
  const [isListOpen, setListOpen] = useState(false); // Controls visibility of chats/contacts list
  
  // Handle opening the list view
  const handleOpenList = () => {
    setListOpen(true);
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedUser(chat);
    setListOpen(false); // Close list when chat is selected
  };

  // Handle back button (mobile)
  const handleBack = () => {
    if (selectedUser) {
      setSelectedUser(null);
      setListOpen(true); // Show list when going back from chat
    } else {
      setListOpen(false); // Close list when going back to initial view
    }
  };

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      {/* Mobile view */}
      <div className="lg:hidden h-full">
        {/* Initial View - New Chat Button */}
        {!isListOpen && !selectedUser && (
          <div className="fixed inset-0 bg-slate-900 flex flex-col">
            <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
              <div className="p-4 border-b border-slate-700/50">
                <h1 className="text-xl font-semibold text-slate-200 mb-4">Messages</h1>
                <button
                  onClick={handleOpenList}
                  className="w-full bg-cyan-500 text-white rounded-lg py-3 font-medium
                  hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chats/Contacts List Panel */}
        <div
          className={`fixed inset-0 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
            isListOpen && !selectedUser ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
            <div className="p-4 border-b border-slate-700/50 flex items-center">
              <button
                onClick={handleBack}
                className="p-2 -ml-2 mr-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg"
                aria-label="Back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-slate-200">Select Contact</h1>
            </div>
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

        {/* Chat Panel */}
        {selectedUser && (
          <div
            className={`fixed inset-0 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
              selectedUser ? 'translate-x-0' : 'translate-x-full'
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
