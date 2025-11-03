import { ChevronDown } from "lucide-react";

const SettingsSectionHeader = ({ icon: Icon, title, isExpanded, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${
          isExpanded 
            ? 'bg-cyan-500/10 text-cyan-500' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-cyan-500'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={`text-base font-medium transition-colors ${
          isExpanded
            ? 'text-cyan-500'
            : 'text-gray-700 dark:text-gray-200'
        }`}>{title}</h3>
      </div>
      <div className={`p-1 rounded-full transition-transform ${
        isExpanded ? 'rotate-180 bg-cyan-500/10' : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        <ChevronDown className={`w-4 h-4 ${
          isExpanded ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'
        }`} />
      </div>
    </button>
  );
};

export default SettingsSectionHeader;