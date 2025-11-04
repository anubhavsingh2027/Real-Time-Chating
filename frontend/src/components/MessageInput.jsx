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

    if (imagePreviews.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
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

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id) => {
    setImagePreviews((prev) => prev.filter((img) => img.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-t border-gray-200 dark:border-slate-700 transition-all duration-300">

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="p-3 border-b border-gray-200 dark:border-slate-700 animate-fade-in">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attached Images ({imagePreviews.length}/5)
              </h4>
              <button
                onClick={() => setImagePreviews([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {imagePreviews.map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-xl overflow-hidden group border border-gray-300 dark:border-slate-700 hover:border-emerald-500 transition-all duration-200"
                >
                  <img
                    src={img.data}
                    alt={img.name}
                    className="w-full h-28 sm:h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-[11px] text-white truncate">{img.name}</p>
                    <p className="text-[10px] text-gray-300">{formatFileSize(img.size)}</p>
                  </div>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                >
                  <PlusIcon className="w-6 h-6 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Add
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
            className={`flex-none p-3 rounded-full transition-colors ${
              imagePreviews.length > 0
                ? "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30"
                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
            title="Attach image"
          >
            <ImageIcon className="w-5 h-5" />
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
              className="w-full bg-gray-100 dark:bg-slate-800 rounded-full py-3 px-4 pr-12 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-500 dark:placeholder:text-slate-400"
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
            className="flex-none p-3 text-white rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
