import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import SearchInput from "./SearchInput";
import { smartNameSearch } from "../lib/searchUtils";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return allContacts;
    
    return allContacts
      .filter(contact => smartNameSearch(contact.fullName, searchQuery))
      .sort((a, b) => {
        // Sort exact matches first
        const aStartsExact = a.fullName.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bStartsExact = b.fullName.toLowerCase().startsWith(searchQuery.toLowerCase());
        
        if (aStartsExact && !bStartsExact) return -1;
        if (!aStartsExact && bStartsExact) return 1;
        
        // Then sort alphabetically
        return a.fullName.localeCompare(b.fullName);
      });
  }, [allContacts, searchQuery]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search contacts..."
      />
      {filteredContacts.length === 0 ? (
        <div className="px-4">
          <p className="text-slate-400 text-center">No contacts found</p>
        </div>
      ) : (
        filteredContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
        ))
      )}
    </>
  );
}
export default ContactList;
