import { useState, useRef, useEffect } from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageBubble({ message, isOwnMessage }) {
  const [showCopy, setShowCopy] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef(null);
  const bubbleRef = useRef(null);

  // Handle desktop hover
  const handleMouseEnter = () => {
    setShowCopy(true);
  };

  const handleMouseLeave = (e) => {
    // Check if we're not hovering over the copy button or its children
    if (!e.relatedTarget?.closest('.copy-button-area')) {
      setShowCopy(false);
    }
  };

  // Handle mobile long press
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default behavior
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowCopy(true);
    }, 500);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault(); // Prevent default behavior
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Handle clicking outside to hide copy button on mobile
  useEffect(() => {
    if (isLongPress) {
      const handleClickOutside = (e) => {
        if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
          setShowCopy(false);
          setIsLongPress(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isLongPress]);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success('Message copied to clipboard');
      // Don't hide the button immediately on mobile
      if (!isLongPress) {
        setShowCopy(false);
      }
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div 
      ref={bubbleRef}
      className={`group relative max-w-[70%] sm:max-w-[55%] md:max-w-[50%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        {message.text && <p className="text-sm break-words">{message.text}</p>}
        
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
          <div className="copy-button-area">
            <button
              onClick={handleCopyMessage}
              className={`absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm
                hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors 
                ${isOwnMessage ? '-left-10' : '-right-10'}`}
              title="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
