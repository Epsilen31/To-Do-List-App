import { format, isSameDay } from 'date-fns';
import { getCalendarStrip } from '../../utils/dateUtils';

export default function DateStrip({ selectedDate, onSelect }) {
  const days = getCalendarStrip(selectedDate);

  return (
    <div className="flex justify-between gap-1 overflow-x-auto px-0.5 scrollbar-none">
      {days.map((day) => {
        const active = isSameDay(day, selectedDate);
        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelect(day)}
            className={`flex min-w-[42px] flex-1 flex-col items-center px-1 pt-2 transition ${
              active
                ? 'rounded-b-2xl rounded-t-md bg-brand-500 pb-2.5 text-white'
                : 'pb-3 text-ink-400'
            }`}
          >
            <span className={`text-[11px] font-medium ${active ? 'text-white/90' : 'text-ink-400'}`}>
              {format(day, 'EEE')}
            </span>
            <span
              className={`mt-1 text-[15px] font-semibold leading-none ${
                active ? 'text-white' : 'text-ink-700'
              }`}
            >
              {format(day, 'd')}
            </span>
            {active && <span className="mt-2 h-1 w-1 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
}
