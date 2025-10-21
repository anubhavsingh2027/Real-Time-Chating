import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import MobileProfileView from "../components/MobileProfileView";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle mobile navigation
  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOpenProfile = () => {
    setSidebarOpen(false);
    setIsProfileOpen(true);
  };

  return (
    <div className="relative h-screen lg:h-[800px] w-full max-w-6xl">
      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {/* Chat List View */}
        <div className={`fixed inset-0 bg-white dark:bg-slate-900 z-10 transition-transform duration-300 ${
          selectedUser || isProfileOpen ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-800/95">
            <div className="bg-emerald-600 dark:bg-slate-800 px-4 py-4 flex items-center">
              <h1 className="text-xl font-semibold text-white">WhatsApp</h1>
              <button
                onClick={handleToggleSidebar}
                className="ml-auto text-white p-2 hover:bg-white/10 rounded-full"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatsList />
            </div>
          </div>
        </div>

        {/* Individual Chat View */}
        <div className={`fixed inset-0 bg-[#efeae2] dark:bg-slate-900 z-20 transition-transform duration-300 ${
          selectedUser ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {selectedUser && (
            <div className="h-full flex flex-col">
              <ChatContainer onBack={handleBack} />
            </div>
          )}
        </div>

        {/* Sliding Sidebar for Contacts */}
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-800 transform transition-transform duration-300 z-50 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="bg-emerald-600 dark:bg-slate-800 px-4 py-3 flex items-center">
              <button
                onClick={handleToggleSidebar}
                className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="ml-2 text-lg font-medium text-white">Menu</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={handleOpenProfile}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={authUser.profilePic || "/avatar.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-slate-900 dark:text-white">My Profile</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">View and edit your profile</p>
                </div>
              </button>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>
        </div>

        {/* Profile View */}
        <div className={`fixed inset-0 bg-[#efeae2] dark:bg-slate-900 z-30 transition-transform duration-300 ${
          isProfileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <MobileProfileView onClose={() => setIsProfileOpen(false)} />
        </div>

        {/* Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleToggleSidebar}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <BorderAnimatedContainer>
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ChatPage;
