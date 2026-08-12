import { SearchIcon } from '../ui/Icons';

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for a task',
  autoFocus = false,
  readOnly = false,
  className = '',
}) {
  return (
    <form
      className={`relative ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink-200 bg-white py-3 pl-3.5 pr-11 text-[14px] text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-800"
        aria-label="Search"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}
