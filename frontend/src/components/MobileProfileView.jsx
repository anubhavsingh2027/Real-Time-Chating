import { useState, useRef } from "react";
import { ArrowLeft, Camera, LogOut, Volume2, VolumeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function MobileProfileView({ onClose }) {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(authUser.fullName);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleNameUpdate = async () => {
    if (name.trim() && name !== authUser.fullName) {
      await updateProfile({ fullName: name.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-800">
      {/* Header */}
      <div className="bg-emerald-600 dark:bg-slate-800 px-4 py-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-medium text-white">Profile</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Avatar Section */}
        <div className="bg-emerald-600/90 dark:bg-slate-700 py-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-emerald-500 dark:bg-slate-600 p-2 rounded-full text-white shadow-lg hover:bg-emerald-600 dark:hover:bg-slate-500 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name Section */}
        <div className="p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
            Name
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-white text-lg outline-none"
                autoFocus
              />
              <button
                onClick={handleNameUpdate}
                className="text-emerald-500 text-sm font-medium"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-slate-900 dark:text-white text-lg">
                {authUser.fullName}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-emerald-500 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="p-4 space-y-4">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(() => {});
              toggleSound();
            }}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg"
          >
            <span className="text-slate-900 dark:text-white">Sound</span>
            {isSoundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <VolumeOff className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg text-red-500"
          >
            <span>Log out</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileProfileView;