import { useState, useRef } from 'react';
import { Check, Copy, MoreVertical, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageBubble({ 
  message, 
  isOwnMessage, 
  onDelete,
  messageStatus = 'sent' // 'sending', 'sent', 'delivered', 'seen'
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const bubbleRef = useRef(null);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success('Message copied to clipboard');
      setShowMenu(false);
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  const handleDeleteMessage = () => {
    onDelete?.(message._id);
    setShowMenu(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };

  const handleTouchStart = () => {
    const timer = setTimeout(() => setShowMenu(true), 500);
    return () => clearTimeout(timer);
  };

  const getStatusIcon = () => {
    switch (messageStatus) {
      case 'sending':
        return (
          <div className="animate-spin w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full" />
        );
      case 'sent':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <Check className="w-3 h-3 text-slate-400" />
            <Check className="w-3 h-3 text-slate-400" />
          </div>
        );
      case 'seen':
        return (
          <div className="flex -space-x-1">
            <Check className="w-3 h-3 text-blue-500" />
            <Check className="w-3 h-3 text-blue-500" />
          </div>
        );
      default:
        return <Check className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div
      ref={bubbleRef}
      className={`group relative max-w-[75%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
    >
      <div
        className={`relative rounded-lg px-3 py-2 ${
          isOwnMessage
            ? 'bg-emerald-500 text-white rounded-tr-none'
            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'
        }`}
      >
        {message.image && (
          <img src={message.image} alt="Shared" className="rounded-lg max-h-60 w-full object-cover mb-1" />
        )}
        {message.text && <p className="text-sm">{message.text}</p>}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[0.65rem] opacity-75">
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwnMessage && (
            <div className="transition-opacity">
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Message Actions Menu */}
        {showMenu && (
          <>
            <div 
              className="absolute z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 w-32"
              style={{ 
                top: '100%', 
                [isOwnMessage ? 'right' : 'left']: '0',
                marginTop: '0.5rem' 
              }}
              ref={menuRef}
            >
              <button
                onClick={handleCopyMessage}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              {isOwnMessage && (
                <button
                  onClick={handleDeleteMessage}
                  className="w-full px-3 py-2 text-sm text-left text-red-500 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
          </>
        )}

        {/* Quick Actions on Hover */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
            ${isOwnMessage ? '-left-8' : '-right-8'}`}
        >
          <button
            onClick={() => setShowMenu(true)}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;