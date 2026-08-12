import { PlusIcon } from './Icons';

export default function FabButton({ onClick, label = 'Add task' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute bottom-5 left-1/2 z-30 flex h-[54px] w-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-fab transition hover:bg-brand-600 active:scale-95"
    >
      <PlusIcon className="h-7 w-7" />
    </button>
  );
}
