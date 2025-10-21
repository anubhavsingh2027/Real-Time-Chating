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
    <div className="flex items-center bg-emerald-600 dark:bg-slate-800 h-16">
      <div className="flex-1 flex items-center gap-4 px-4">
        <button
          onClick={onBack}
          className="lg:hidden text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-white font-medium leading-tight">{selectedUser.fullName}</h3>
            <p className="text-emerald-100 dark:text-slate-300 text-sm leading-tight">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors mr-2">
        <MoreVertical className="w-6 h-6" />
      </button> */}
    </div>
  );
}
export default ChatHeader;
