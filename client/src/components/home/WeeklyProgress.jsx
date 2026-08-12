import { progressPercent } from '../../utils/dateUtils';

export default function WeeklyProgress({ completed = 0, total = 0 }) {
  const percent = progressPercent(completed, total);

  return (
    <section>
      <h2 className="mb-3 text-[15px] font-semibold text-ink-900">Weekly Progress</h2>
      <div className="h-2.5 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}
