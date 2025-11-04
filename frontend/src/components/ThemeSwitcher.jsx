import { Moon, Sun } from "lucide-react";
import useSettingsStore from "../store/useSettingsStore";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex items-center justify-between relative z-10">
      <label htmlFor="theme-switcher" className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
      <button
        id="theme-switcher"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white transition-colors relative z-10"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
