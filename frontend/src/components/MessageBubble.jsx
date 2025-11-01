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
  // Custom toast state for bottom-center reaction feedback
  const [reactionToast, setReactionToast] = useState(null);
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
      setShowActions(false);
      // Show custom bottom-center toast
      setReactionToast(emoji);
      setTimeout(() => setReactionToast(null), 2000);
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
    ? 'bg-emerald-500 text-white'
    : 'bg-gray-800 text-gray-100 dark:bg-slate-700 dark:text-slate-100';

  // --- Bubble arrow style ---
  const arrowSize = 16;
  const arrowStyle = isOwnMessage
    ? {
        right: -arrowSize + 2,
        top: 12,
        width: arrowSize,
        height: arrowSize,
        position: 'absolute',
        zIndex: 1,
        background: 'var(--bubble-bg, #10b981)',
        clipPath:
          'polygon(0 0, 100% 50%, 0 100%)',
        boxShadow: '2px 2px 6px 0 rgba(0,0,0,0.08)',
      }
    : {
        left: -arrowSize + 2,
        top: 12,
        width: arrowSize,
        height: arrowSize,
        position: 'absolute',
        zIndex: 1,
        background: 'var(--bubble-bg, #1e293b)',
        clipPath:
          'polygon(100% 0, 0 50%, 100% 100%)',
        boxShadow: '-2px 2px 6px 0 rgba(0,0,0,0.08)',
      };

  // --- Popup dynamic positioning ---
  const [popupPos, setPopupPos] = useState('below');
  useEffect(() => {
    if (!showActions) return;
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const rect = bubble.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    setPopupPos(spaceBelow < 180 && spaceAbove > spaceBelow ? 'above' : 'below');
  }, [showActions]);

  // --- CSS variables for theme consistency ---
  const rootVars = {
    '--popup-bg': 'var(--popup-bg, #fff)',
    '--popup-shadow': 'var(--popup-shadow, 0 4px 24px 0 rgba(0,0,0,0.12))',
    '--toast-bg': 'var(--toast-bg, #222c)',
    '--bubble-bg': isOwnMessage ? '#10b981' : '#1e293b',
  };

  return (
    <div
      className={`w-full flex ${containerAlign} mb-2 px-3`}
      ref={bubbleRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={rootVars}
    >
      <div className="relative max-w-[85%] flex flex-col items-end">
        <div className="relative">
          {/* Bubble arrow */}
          <div style={arrowStyle} />
          <div
            className={`group inline-flex flex-col items-start gap-2 p-2.5 sm:p-3 rounded-2xl shadow-sm transition-all duration-200 ${
              isOwnMessage ? 'rounded-tr-2xl rounded-br-none' : 'rounded-tl-2xl rounded-bl-none'
            } ${bubbleBackground} bg-opacity-95`}
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
        </div>

        {/* Reaction / options button (hover or long press) */}
        <div
          className={`absolute top-0 ${isOwnMessage ? 'right-0' : 'left-0'} transform translate-y-[-8px] transition-opacity duration-200 ${
            showMenuButton ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
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

          {/* Menu panel, dynamic position */}
          {showActions && (
            <div
              className={`fixed z-50`}
              style={{
                left: (() => {
                  const rect = bubbleRef.current?.getBoundingClientRect();
                  if (!rect) return 0;
                  return isOwnMessage ? rect.right - 220 : rect.left;
                })(),
                top: (() => {
                  const rect = bubbleRef.current?.getBoundingClientRect();
                  if (!rect) return 0;
                  if (popupPos === 'above') return rect.top - 60;
                  return rect.bottom + 8;
                })(),
                minWidth: 180,
                maxWidth: 240,
              }}
            >
              <div
                className={`rounded-[13px] shadow-lg py-2 px-2 backdrop-blur-sm border border-black/5 dark:border-white/10 transition-all duration-200 scale-100 opacity-100 bg-[var(--popup-bg)]`}
                style={{
                  boxShadow: 'var(--popup-shadow)',
                  background: 'var(--popup-bg)',
                  padding: 12,
                  minWidth: 180,
                  maxWidth: 240,
                }}
              >
                {/* Copy */}
                <button
                  onClick={handleCopyMessage}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                  Copy
                </button>
                {/* Emoji row */}
                <div className="flex items-center justify-between gap-1 px-1 mt-2 mb-1">
                  {reactions.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleReaction(r)}
                      className="text-lg p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      title={r}
                      style={{ fontSize: 22 }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-2 border-t border-gray-100 dark:border-white/5" />
                {/* Delete */}
                {isOwnMessage && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Custom bottom-center reaction toast */}
        {reactionToast && (
          <div
            className="fixed left-1/2 bottom-8 z-[9999] px-4 py-2 rounded-lg text-white text-base font-medium shadow-lg animate-fadeout"
            style={{
              background: 'var(--toast-bg)',
              transform: 'translateX(-50%)',
              transition: 'opacity 0.4s',
              opacity: reactionToast ? 1 : 0,
            }}
          >
            Reacted with {reactionToast}
          </div>
        )}

        {/* Reactions preview */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-2 right-2 bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 shadow-md border border-gray-200 dark:border-slate-700 flex items-center gap-1 text-sm">
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
