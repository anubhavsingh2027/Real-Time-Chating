import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer({ onBack }) {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader onBack={onBack} />
      <div className="flex-1 px-3 sm:px-6 overflow-y-auto py-4 sm:py-8 bg-[#efeae2] dark:bg-slate-900">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[75%] rounded-lg px-3 py-2 ${
                    msg.senderId === authUser._id
                      ? "bg-emerald-500 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg max-h-60 w-full object-cover mb-1" />
                  )}
                  {msg.text && <p className="text-sm">{msg.text}</p>}
                  <p className="text-[0.65rem] mt-1 opacity-75 flex items-center justify-end gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
