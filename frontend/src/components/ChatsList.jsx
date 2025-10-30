import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import SearchInput from "./SearchInput";
import { smartNameSearch } from "../lib/searchUtils";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;

    return chats
      .filter(chat => smartNameSearch(chat.fullName, searchQuery))
      .sort((a, b) => {
        // Sort exact matches first
        const aStartsExact = a.fullName.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bStartsExact = b.fullName.toLowerCase().startsWith(searchQuery.toLowerCase());

        if (aStartsExact && !bStartsExact) return -1;
        if (!aStartsExact && bStartsExact) return 1;

        // Then sort alphabetically
        return a.fullName.localeCompare(b.fullName);
      });
  }, [chats, searchQuery]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search chats..."
      />
      {filteredChats.length === 0 ? (
        <div className="px-4">
          <p className="text-slate-400 text-center">No chats found</p>
        </div>
      ) : (
        filteredChats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
          </div>
        </div>
        ))
      )}
    </>
  );
}
export default ChatsList;
