import { Search } from 'lucide-react';

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4 px-4">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-4 bg-gray-100 dark:bg-cyan-500/5 rounded-lg
            border border-gray-200 dark:border-cyan-500/10 focus:border-cyan-500/20
            text-black dark:text-slate-200 placeholder:text-gray-500 dark:placeholder:text-slate-400
            focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-slate-400" />
      </div>
    </div>
  );
}

export default SearchInput;