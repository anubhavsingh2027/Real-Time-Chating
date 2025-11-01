import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Copy, Check, Download, ZoomIn, Trash2, Reply, Forward, Heart, ThumbsUp, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLayoutEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function MessageBubble({
  message,
  isOwnMessage,
  messageStatus = 'sent',
  onReply,
  onDelete,
  onForward
}) {
  const [showActions, setShowActions] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const { addReaction, removeReaction } = useChatStore();
  const { authUser } = useAuthStore();
  const longPressTimer = useRef(null);
  const bubbleRef = useRef(null);
  const messageTextRef = useRef(null);
  const [dynamicWidth, setDynamicWidth] = useState('fit-content');

  const reactions = [
    { emoji: '❤️', name: 'heart' },
    { emoji: '👍', name: 'thumbs-up' },
    { emoji: '😊', name: 'smile' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
  ];

  useLayoutEffect(() => {
    if (messageTextRef.current && bubbleRef.current && message.text) {
      const containerWidth = bubbleRef.current.parentElement.offsetWidth;
      const textWidth = messageTextRef.current.offsetWidth;
      const widthPercentage = (textWidth / containerWidth) * 100;

      if (widthPercentage > 30) {
        setDynamicWidth('30%');
      } else {
        setDynamicWidth(`${Math.min(widthPercentage + 2, 30)}%`);
      }
    }
  }, [message.text]);

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

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(message.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
      setShowActions(false);
    } catch (err) {
      toast.error('Failed to download image');
    }
  };

  const handleZoomImage = () => {
    setShowImageModal(true);
    setShowActions(false);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
      toast.success('Reply to message set');
    }
    setShowActions(false);
    setIsLongPress(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this message?')) {
        onDelete(message._id);
        toast.success('Message deleted');
      }
    }
    setShowActions(false);
    setIsLongPress(false);
  };

  const handleForward = () => {
    if (onForward) {
      onForward(message);
      toast.success('Message ready to forward');
    }
    setShowActions(false);
    setIsLongPress(false);
  };

  const handleReaction = async (reaction) => {
    setShowReactions(false);
    setShowActions(false);
    await addReaction(message._id, reaction.emoji);
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowActions(prev => !prev);
  };

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

  useEffect(() => {
    if (showActions || isLongPress) {
      const handleClickOutside = (e) => {
        if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
          setShowActions(false);
          setIsLongPress(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActions, isLongPress]);

  const getStatusIcon = () => {
    switch (messageStatus) {
      case 'sending':
        return <div className="animate-spin w-4 h-4 border-2 border-black dark:border-white border-t-transparent rounded-full" />;
      case 'sent':
        return <Check className="w-4 h-4 text-black dark:text-white" strokeWidth={2} />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <Check className="w-4 h-4 text-black dark:text-white" strokeWidth={2} />
            <Check className="w-4 h-4 text-black dark:text-white" strokeWidth={2} />
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

  return (
    <>
      <div
        ref={bubbleRef}
        style={{ width: message.text ? dynamicWidth : 'auto' }}
        className={`group relative min-w-[120px] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`relative rounded-lg px-3.5 py-2.5
            ${isOwnMessage ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'}
            transition-all duration-200 ease-in-out`}
        >
          {message.image && (
            <div className="relative group/image mb-1">
              <img
                src={message.image}
                alt="Shared"
                className="rounded-lg max-w-[200px] sm:max-w-[280px] w-auto max-h-[300px] object-cover cursor-pointer"
                onClick={handleZoomImage}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          {message.text && (
            <div ref={messageTextRef} className="inline-block max-w-full">
              <p className="text-[0.9375rem] leading-[1.4] break-words whitespace-pre-wrap tracking-wide font-normal">
                {message.text}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[0.65rem] opacity-75">
              {new Date(message.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOwnMessage && <div className="flex items-center transition-opacity duration-200">{getStatusIcon()}</div>}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 right-2 bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 shadow-md border border-gray-200 dark:border-slate-600 flex items-center gap-1">
              {message.reactions.slice(0, 3).map((reaction, idx) => (
                <span key={`${reaction.userId}-${idx}`} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
              {message.reactions.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{message.reactions.length - 3}
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleToggleMenu}
            className={`absolute ${isOwnMessage ? '-left-7' : '-right-7'} top-1/2 -translate-y-1/2
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              p-1.5 rounded-full bg-gray-200/50 dark:bg-slate-800/50 backdrop-blur-sm
              hover:bg-gray-300 dark:hover:bg-slate-700 z-10`}
            title="Message options"
          >
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>

          {showActions && (
            <div
              className={`absolute z-[60] ${
                isLongPress
                  ? `top-1/2 -translate-y-1/2 ${isOwnMessage ? '-left-36' : '-right-36'}`
                  : `${isOwnMessage ? 'left-0' : 'right-0'} -top-2 ${isOwnMessage ? '-translate-x-full' : 'translate-x-full'}`
              }`}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-1 w-36">
                <div className="relative">
                  <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Smile className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span className="text-black dark:text-white">React</span>
                  </button>
                  {showReactions && (
                    <div className="absolute left-full top-0 ml-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-2 flex gap-1 z-[70]">
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.name}
                          onClick={() => handleReaction(reaction)}
                          className="text-xl hover:scale-125 transition-transform p-1"
                          title={reaction.name}
                        >
                          {reaction.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleReply}
                  className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Reply className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-black dark:text-white">Reply</span>
                </button>

                {message.text && (
                  <button
                    onClick={handleCopyMessage}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span className="text-black dark:text-white">Copy</span>
                  </button>
                )}

                {message.image && (
                  <>
                    <button
                      onClick={handleZoomImage}
                      className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-black dark:text-white">View</span>
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span className="text-black dark:text-white">Download</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleForward}
                  className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Forward className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-black dark:text-white">Forward</span>
                </button>

                {isOwnMessage && (
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showImageModal && message.image && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={message.image}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadImage();
              }}
              className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-colors z-10"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBubble;
