import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, isSoundEnabled } = useChatStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const quickMessages = [
    { icon: "👋", text: "Hello!" },
    { icon: "🤝", text: "How are you?" },
    { icon: "📅", text: "Meet up soon?" }
  ];

  const handleSendMessage = (message) => {
    if (isSoundEnabled) {
      playRandomKeyStrokeSound();
    }
    sendMessage({ text: message });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 dark:from-cyan-500/20 dark:to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-cyan-500 dark:text-cyan-400" />
      </div>
      <h3 className="text-lg font-medium text-black dark:text-slate-200 mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent dark:via-cyan-500/30 mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {quickMessages.map(({ icon, text }) => (
          <button
            key={text}
            onClick={() => handleSendMessage(text)}
            className="px-4 py-2 text-xs font-medium text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 dark:hover:bg-cyan-500/20 transition-colors active:scale-95 transform duration-100"
          >
            {icon} {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
