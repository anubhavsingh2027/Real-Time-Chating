import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, PlusIcon, FileIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

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


      {/* Compact Image Preview */}
      {imagePreviews.length > 0 && (
        <div className="px-3 pt-2">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {imagePreviews.map((img, index) => (
                <div
                  key={img.id}
                  className="relative flex-none group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-emerald-500 dark:border-emerald-600 bg-gray-100 dark:bg-slate-700">
                    <img
                      src={img.data}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="text-[10px] text-white font-medium truncate">
                          {formatFileSize(img.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110"
                    type="button"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                  <div className="absolute -bottom-1 -left-1 h-5 min-w-5 px-1.5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}

              {/* Inline Add More Button */}
              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 flex-none rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  <PlusIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 font-medium transition-colors">
                    Add More
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 pt-1">
        <div className="max-w-3xl mx-auto flex items-end space-x-2">
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
              className="w-full bg-gray-100 dark:bg-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 placeholder:text-gray-500 dark:placeholder:text-slate-400"
              placeholder={
                imagePreviews.length > 0
                  ? "Add a caption (optional)..."
                  : "Type a message..."
              }
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`absolute left-2 bottom-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-all ${
                imagePreviews.length > 0
                  ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                  : "text-gray-500 dark:text-slate-400"
              }`}
              title="Add images (Max 5, up to 5MB each)"
            >
              <ImageIcon className="w-5 h-5" />
              {imagePreviews.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">
                    {imagePreviews.length}
                  </span>
                </div>
              )}
            </button>
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
            className="flex-none p-3 text-white rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
