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
      if (e.key === 'Escape') setShowImageModal(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

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
    }, 600); // 600ms long press
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const containerAlign = isOwnMessage ? 'justify-end' : 'justify-start';
  const bubbleBackground = isOwnMessage
    ? 'bg-emerald-500 text-white'
    : 'bg-gray-800 text-gray-100 dark:bg-slate-700 dark:text-slate-100';

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

        {/* Reaction / options button (hover or long press) */}
        <div
          className={`relative ${isOwnMessage ? 'right-0' : 'left-0'} mt-1 transition-opacity duration-300 ${
            showMenuButton ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <button
            onClick={() => setShowActions((s) => !s)}
            className="-translate-y-2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all duration-300"
            aria-label="message actions"
          >
            <ChevronDown className={`w-4 h-4 ${isOwnMessage ? 'text-white/80' : 'text-gray-300'}`} />
          </button>

          {showActions && (
            <div className={`absolute z-50 ${isOwnMessage ? 'right-0' : 'left-0'} mt-2`}>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 w-40">
                <div className="flex flex-col">
                  <button
                    onClick={handleCopyMessage}
                    className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-gray-500" /> Copy
                  </button>

                  {message.image && (
                    <>
                      <button
                        onClick={() => {
                          setShowImageModal(true);
                          setShowActions(false);
                        }}
                        className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <ZoomIn className="w-4 h-4 text-gray-500" /> View
                      </button>
                      <button
                        onClick={() => handleDownloadImage(message.image)}
                        className="px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-gray-500" /> Download
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                  <div className="px-2 py-1 flex items-center gap-1">
                    {reactions.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleReaction(r)}
                        className="text-lg p-1 hover:scale-110 transition-transform"
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  {isOwnMessage && (
                    <>
                      <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                      <button
                        onClick={handleDelete}
                        className="px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

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
