import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  debounceMs = 150,
  placeholder = 'Search skills by name, stack, category, or description...',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce notification
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs, value]);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div role="search" className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center gap-1">
        <Search className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search agent skills catalog"
        className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/80 shadow-xs transition-all"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {localValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-[10px] font-mono text-slate-400 select-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  );
};
