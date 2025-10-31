import { Moon, Sun } from "lucide-react";
import useSettingsStore from "../store/useSettingsStore";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex items-center justify-between">
      <label htmlFor="theme-switcher">Theme</label>
      <button
        id="theme-switcher"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
