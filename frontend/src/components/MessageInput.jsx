import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, PlusIcon, FileIcon, Reply } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled, replyToMessage, clearReplyToMessage } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && imagePreviews.length === 0) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    // Send first image only for now (can be enhanced to send multiple)
    sendMessage({
      text: text.trim(),
      image: imagePreviews.length > 0 ? imagePreviews[0].data : null,
    });

    setText("");
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Limit to 5 images
    if (imagePreviews.length + files.length > 5) {
      toast.error("You can only upload up to 5 images at a time");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            data: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (imageId) => {
    setImagePreviews((prev) => prev.filter((img) => img.id !== imageId));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="px-3 pt-3 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-slate-700 rounded-lg p-3 flex items-start gap-3">
            <Reply className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Replying to message
              </p>
              {replyToMessage.image && (
                <img
                  src={replyToMessage.image}
                  alt="Reply preview"
                  className="w-12 h-12 rounded object-cover mb-1"
                />
              )}
              {replyToMessage.text && (
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {replyToMessage.text}
                </p>
              )}
            </div>
            <button
              onClick={clearReplyToMessage}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors flex-shrink-0"
              type="button"
            >
              <XIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Selected Images ({imagePreviews.length}/5)
              </h4>
              <button
                onClick={() => setImagePreviews([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {imagePreviews.map((img) => (
                <div
                  key={img.id}
                  className="relative group bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                >
                  <div className="aspect-square relative">
                    <img
                      src={img.data}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs text-white font-medium truncate">
                          {img.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {formatFileSize(img.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110"
                    type="button"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <PlusIcon className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Add More
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex-none p-3 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors ${
              imagePreviews.length > 0
                ? "text-emerald-500"
                : "text-gray-500 dark:text-slate-400"
            }`}
            title="Add images (Max 5, up to 5MB each)"
          >
            <ImageIcon className="w-6 h-6" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                isSoundEnabled && playRandomKeyStrokeSound();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full bg-gray-100 dark:bg-slate-700 rounded-full py-3 px-4 pr-12 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 placeholder:text-gray-500 dark:placeholder:text-slate-400"
              placeholder={
                imagePreviews.length > 0
                  ? "Add a caption (optional)..."
                  : "Type a message..."
              }
            />
            {imagePreviews.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                <FileIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {imagePreviews.length}
                </span>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            multiple
          />

          <button
            type="submit"
            disabled={!text.trim() && imagePreviews.length === 0}
            className="flex-none p-3 text-white rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
