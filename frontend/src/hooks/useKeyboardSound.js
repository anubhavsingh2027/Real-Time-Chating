import useSettingsStore from "../store/useSettingsStore";

// audio setup
const keyStrokeSounds = {
  keystroke1: new Audio("/sounds/keystroke1.mp3"),
  keystroke2: new Audio("/sounds/keystroke2.mp3"),
  keystroke3: new Audio("/sounds/keystroke3.mp3"),
  keystroke4: new Audio("/sounds/keystroke4.mp3"),
  "mouse-click": new Audio("/sounds/mouse-click.mp3"),
};

function useKeyboardSound() {
  const { soundEffects, keyboardSound } = useSettingsStore();

  const playRandomKeyStrokeSound = () => {
    if (!soundEffects) return;
    const sound = keyStrokeSounds[keyboardSound];

    if (sound) {
      sound.currentTime = 0; // this is for a better UX, def add this
      sound.play().catch((error) => {});
    }
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
