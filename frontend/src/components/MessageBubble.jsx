import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Copy,
  Check,
  Download,
  ZoomIn,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function MessageBubble({ message, isOwnMessage, messageStatus = 'sent', onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(false);
  const longPressTimer = useRef(null);
  const bubbleRef = useRef(null);
  const imageRef = useRef(null);
  const { addReaction } = useChatStore();
  const { authUser } = useAuthStore();

  const reactions = ['❤️', '👍', '😊', '😂', '😮', '😢'];

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
        setShowActions(false);
        setShowMenuButton(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  // Close actions dropdown when clicking outside or tapping outside on mobile
  useEffect(() => {
    if (!showActions) return;

    const onDocClick = (e) => {
      const el = bubbleRef.current;
      if (!el) return;
      if (!el.contains(e.target)) {
        setShowActions(false);
        setShowMenuButton(false);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
    };
  }, [showActions]);

  // Ensure only one dropdown is open at a time across MessageBubble instances
  useEffect(() => {
    const onOtherOpen = (e) => {
      const otherId = e.detail?.id;
      if (!otherId) return;
      if (otherId !== message._id) {
        setShowActions(false);
        setShowMenuButton(false);
      }
    };
    window.addEventListener('message-dropdown-open', onOtherOpen);
    return () => window.removeEventListener('message-dropdown-open', onOtherOpen);
  }, [message._id]);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text || '');
      toast.success('Copied');
      setShowActions(false);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleDownloadImage = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const ext = (blob.type || 'image/jpeg').split('/')[1] || 'jpg';
      link.download = `image-${Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const handleReaction = async (emoji) => {
    try {
      await addReaction(message._id, emoji);
      // show success feedback and close menu
      toast.success(`Reacted with ${emoji}`);
      setShowActions(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (confirm('Delete this message?')) {
      onDelete(message._id);
    }
  };

  const getStatusIcon = () => {
    switch (messageStatus) {
      case 'sending':
        return <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />;
      case 'sent':
        return <Check className="w-4 h-4 text-white" strokeWidth={2} />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <Check className="w-4 h-4 text-white/90" strokeWidth={2} />
            <Check className="w-4 h-4 text-white/90" strokeWidth={2} />
          </div>
        );
      case 'seen':
        return (
          <div className="flex -space-x-1">
            <Check className="w-4 h-4 text-sky-400" strokeWidth={2.5} />
            <Check className="w-4 h-4 text-sky-400" strokeWidth={2.5} />
          </div>
        );
      default:
        return null;
    }
  };

  // Hover + Long Press Behavior
  const handleMouseEnter = () => setShowMenuButton(true);
  const handleMouseLeave = () => {
    if (!showActions) setShowMenuButton(false);
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowActions(true);
      setShowMenuButton(true);
      // notify others to close
      window.dispatchEvent(new CustomEvent('message-dropdown-open', { detail: { id: message._id } }));
    }, 600); // 600ms long press
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const containerAlign = isOwnMessage ? 'justify-end' : 'justify-start';
  const bubbleBackground = isOwnMessage
    ? 'bg-emerald-500 text-white before:border-r-emerald-500'
    : 'bg-gray-800 text-gray-100 dark:bg-slate-700 dark:text-slate-100 before:border-l-gray-800 dark:before:border-l-slate-700';

  return (
    <div
      className={`w-full flex ${containerAlign} mb-2 px-3`}
      ref={bubbleRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative max-w-[85%] flex flex-col items-end">
        <div
          className={`group relative inline-flex flex-col items-start gap-2 p-2.5 sm:p-3 rounded-2xl shadow-sm transition-all duration-200 
            before:content-[''] before:absolute before:w-0 before:h-0 
            before:border-[6px] before:border-transparent
            ${isOwnMessage ? 
              'rounded-tr-sm rounded-br-none before:-right-[11px] before:top-[6px] before:border-r-0' : 
              'rounded-tl-sm rounded-bl-none before:-left-[11px] before:top-[6px] before:border-l-0'
            } 
            ${bubbleBackground} bg-opacity-95`}
        >
          {/* Image (if present) */}
          {message.image && (
            <div className="w-auto max-w-[60vw] sm:max-w-[40vw] md:max-w-[320px] rounded-lg overflow-hidden shadow-sm">
              <img
                ref={imageRef}
                src={message.image}
                alt={message.text ? 'attachment' : 'image'}
                onClick={() => setShowImageModal(true)}
                onError={(e) => (e.currentTarget.style.display = 'none')}
                className="w-auto h-auto max-w-full max-h-[60vh] object-contain cursor-pointer block"
              />
            </div>
          )}

          {/* Text */}
          {message.text && (
            <div className="text-sm leading-5 break-words whitespace-pre-wrap">
              <span className="block">{message.text}</span>
            </div>
          )}

          {/* Timestamp + status */}
          <div className="flex items-center gap-2 self-end mt-0.5">
            <time className={`text-[11px] opacity-80 ${isOwnMessage ? 'text-white/80' : 'text-gray-300'}`}>
              {message.createdAt
                ? new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </time>
            {isOwnMessage && <div className="flex items-center">{getStatusIcon()}</div>}
          </div>
        </div>

        {/* Reaction / options button (hover or long press) */}
        <div
          className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} transform -translate-y-[42px] transition-all duration-200 ${
            showMenuButton ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
          }`}
        >
          <div className="flex items-start">
            <button
              onClick={() => {
                const next = !showActions;
                setShowActions(next);
                setShowMenuButton(true);
                if (next) {
                  // notify others to close
                  window.dispatchEvent(new CustomEvent('message-dropdown-open', { detail: { id: message._id } }));
                }
              }}
              className={`-translate-y-1 p-1.5 rounded-full transition-all duration-150 focus:outline-none ${
                isOwnMessage ? 'bg-emerald-600/20 hover:bg-emerald-600/30' : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label="message actions"
            >
              <ChevronDown className={`w-4 h-4 ${isOwnMessage ? 'text-white/90' : 'text-gray-300'}`} />
            </button>

            {/* Menu panel */}
              <div className={`${isOwnMessage ? 'ml-2' : 'mr-2'} relative z-50`}>
              <div
                className={`transform ${isOwnMessage ? 'origin-top-left' : 'origin-top-right'} transition-all duration-150 ease-out ${
                  showActions ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="rounded-xl shadow-lg py-2 w-52 backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10">
                  {/* Copy */}
                  <div className="px-2">
                    <button
                      onClick={() => {
                        handleCopyMessage();
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                      Copy
                    </button>
                  </div>

                  {/* Emoji row */}
                  <div className="px-2 pt-1">
                    <div className="flex items-center justify-between gap-1 px-1">
                      {reactions.map((r) => (
                        <button
                          key={r}
                          onClick={() => handleReaction(r)}
                          className="text-lg p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                          title={r}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 border-t border-gray-100 dark:border-white/5" />

                  {/* Delete */}
                  {isOwnMessage && (
                    <div className="px-2 mt-1">
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reactions preview */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`absolute -bottom-2 ${isOwnMessage ? 'right-2' : 'left-2'} bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 shadow-md border border-gray-200 dark:border-slate-700 flex items-center gap-1 text-sm`}>
            {message.reactions.slice(0, 3).map((r, i) => (
              <span key={i}>{r.emoji || r}</span>
            ))}
            {message.reactions.length > 3 && (
              <span className="text-xs text-gray-500">+{message.reactions.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Image modal */}
      {showImageModal && message.image && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-[95%] max-h-[95%]">
            <img
              src={message.image}
              alt="preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
              aria-label="close preview"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadImage(message.image);
              }}
              className="absolute bottom-3 right-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
