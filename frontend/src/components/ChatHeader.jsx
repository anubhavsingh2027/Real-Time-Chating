import { ArrowLeft, MoreVertical } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader({ onBack }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-emerald-600 dark:bg-slate-800 h-16 px-4">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onBack}
          className="md:hidden text-white hover:bg-emerald-700 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName}
              className="w-full h-full object-cover" 
            />
          </div>

          <div>
            <h3 className="text-white font-medium">{selectedUser.fullName}</h3>
            <p className="text-emerald-100 dark:text-slate-300 text-xs">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      <button className="text-white hover:bg-emerald-700 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
}
export default ChatHeader;
