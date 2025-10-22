function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 text-slate-400 text-sm py-1 px-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>typing</span>
    </div>
  );
}

export default TypingIndicator;