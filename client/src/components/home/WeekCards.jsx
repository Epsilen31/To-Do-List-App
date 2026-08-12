import { useEffect, useState } from 'react';
import { ChevronIcon } from '../ui/Icons';
import TaskList from './TaskList';

export default function WeekCards({
  weeks = [],
  onToggle,
  onEdit,
  onDelete,
  initiallyExpandedKey = null,
}) {
  const [expandedKey, setExpandedKey] = useState(initiallyExpandedKey);

  useEffect(() => {
    if (initiallyExpandedKey) {
      setExpandedKey(initiallyExpandedKey);
    }
  }, [initiallyExpandedKey]);

  if (!weeks.length) {
    return (
      <div className="border-t border-ink-200 py-10 text-center">
        <p className="text-sm text-ink-400">No weekly tasks yet. Add your first task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weeks.map((week) => {
        const isOpen = expandedKey === week.weekKey;
        return (
          <section key={week.weekKey} className="overflow-hidden rounded-xl border border-ink-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              onClick={() => setExpandedKey(isOpen ? null : week.weekKey)}
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">{week.label}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">Mon – Sun</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-[11px]">
                  <p className="font-semibold text-brand-500">{week.openCount} open</p>
                  <p className="font-medium text-ink-400">{week.completedCount} done</p>
                </div>
                <ChevronIcon open={isOpen} className="h-4 w-4 text-ink-400" />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-ink-200 px-3 pb-2">
                <TaskList
                  tasks={week.tasks}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  emptyMessage="No tasks in this week"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
