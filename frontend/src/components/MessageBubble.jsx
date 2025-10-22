import { useState, useRef, useEffect } from 'react';
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

  // Toggle menu on down arrow click
  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowActions(prev => !prev);
  };

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

  // Use effect to handle clicking outside
  useEffect(() => {
    if (showActions || isLongPress) {
      const handleClickOutside = (e) => {
        if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
          setShowActions(false);
          setIsLongPress(false);
        }
      };

      // Add the event listener to the document
      document.addEventListener('click', handleClickOutside);

      // Cleanup the event listener when the component unmounts or menu closes
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showActions, isLongPress]);

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
      className={`group relative max-w-[60%] sm:max-w-[50%] md:max-w-[45%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative rounded-lg px-3.5 py-2.5
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
        {message.text && (
          <p className="text-[0.9375rem] leading-[1.4] break-words whitespace-pre-wrap tracking-wide font-normal">
            {message.text}
          </p>
        )}

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

        {/* Down Arrow Button */}
        <button
          onClick={handleToggleMenu}
          className={`absolute ${isOwnMessage ? '-left-7' : '-right-7'} top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            p-1.5 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm
            hover:bg-slate-200 dark:hover:bg-slate-700`}
          title="Message options"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Actions Menu */}
        {showActions && message.text && (
          <div
            className={`absolute z-50 ${
              isLongPress
                ? `top-1/2 -translate-y-1/2 ${isOwnMessage ? '-left-28' : '-right-28'}`
                : `${isOwnMessage ? 'left-0' : 'right-0'} -top-2 ${isOwnMessage ? '-translate-x-full' : 'translate-x-full'}`
            }`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 w-28">
              <button
                onClick={handleCopyMessage}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2
                  hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
