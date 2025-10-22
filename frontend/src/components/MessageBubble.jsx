import { useState } from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageBubble({ message, isOwnMessage }) {
  const [showCopy, setShowCopy] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success('Message copied to clipboard');
      setShowCopy(false);
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div 
      className={`group relative max-w-[75%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <div
        className={`relative rounded-lg px-3 py-2 ${
          isOwnMessage
            ? 'bg-emerald-500 text-white rounded-tr-none'
            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'
        }`}
      >
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared" 
            className="rounded-lg max-h-60 w-full object-cover mb-1" 
          />
        )}
        {message.text && <p className="text-sm">{message.text}</p>}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[0.65rem] opacity-75">
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Copy Button */}
        {showCopy && message.text && (
          <button
            onClick={handleCopyMessage}
            className={`absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm
              hover:bg-white/20 transition-colors ${isOwnMessage ? '-left-10' : '-right-10'}`}
            title="Copy message"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
