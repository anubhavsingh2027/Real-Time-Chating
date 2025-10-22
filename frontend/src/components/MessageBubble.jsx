import { useState, useRef } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageBubble({ 
  message, 
  isOwnMessage,
  messageStatus = 'sent' // 'sending', 'sent', 'delivered', 'seen'
}) {
  const [showActions, setShowActions] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef(null);
  const bubbleRef = useRef(null);

  // Handle message copy
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success('Message copied!');
      setShowActions(false);
      setIsLongPress(false);
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  // Desktop hover handlers
  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => !isLongPress && setShowActions(false);

  // Mobile long press handlers
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowActions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Handle clicking outside to dismiss actions
  const handleClickOutside = (e) => {
    if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
      setShowActions(false);
      setIsLongPress(false);
    }
  };

  // Get status icon based on message state
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
        return null;
    }
  };

  return (
    <div 
      ref={bubbleRef}
      className={`group relative max-w-[65%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClickOutside}
    >
      <div
        className={`relative rounded-lg px-3 py-2 
          ${isOwnMessage
            ? 'bg-emerald-500 text-white rounded-tr-none'
            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'
          }
          transition-all duration-200 ease-in-out
        `}
      >
        {/* Message Content */}
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared" 
            className="rounded-lg max-h-60 w-full object-cover mb-1" 
          />
        )}
        {message.text && <p className="text-sm break-words">{message.text}</p>}

        {/* Footer: Time and Status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[0.65rem] opacity-75">
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwnMessage && (
            <div className="transition-opacity duration-200">
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Actions Menu */}
        {showActions && message.text && (
          <div className="absolute z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 w-24">
            {/* Desktop: Show at bottom */}
            <div className={`${!isLongPress ? 'block' : 'hidden'} absolute bottom-0 
              ${isOwnMessage ? 'right-0' : 'left-0'} 
              transform translate-y-full mt-1`}>
              <button
                onClick={handleCopyMessage}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 
                  hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            {/* Mobile: Show centered */}
            <div className={`${isLongPress ? 'block' : 'hidden'} absolute top-1/2 
              ${isOwnMessage ? '-left-28' : '-right-28'} 
              transform -translate-y-1/2`}>
              <button
                onClick={handleCopyMessage}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 
                  hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
                  bg-white dark:bg-slate-800 rounded-lg shadow-lg"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Desktop Hover Menu Trigger */}
        {!isLongPress && (
          <div className={`absolute ${isOwnMessage ? '-left-6' : '-right-6'} top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
            <button
              onClick={() => setShowActions(true)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
