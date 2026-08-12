import { useRef, useState } from 'react';
import { EditIcon, TrashIcon } from '../ui/Icons';
import { TASK_STATUS } from '../../constants';

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  const completed = task.status === TASK_STATUS.COMPLETED;

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging.current = true;
    startX.current = event.clientX;
  }

  function handlePointerMove(event) {
    if (!dragging.current) return;
    const delta = event.clientX - startX.current;
    setOffset(Math.min(0, Math.max(-88, delta)));
  }

  function handlePointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    setOffset((current) => (current < -48 ? -88 : 0));
  }

  async function handleDeleteClick(event) {
    event.stopPropagation();
    await onDelete(task.id);
    setOffset(0);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 flex w-[88px] items-stretch">
        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex w-[88px] items-center justify-center bg-coral-500 text-sm font-semibold text-white"
        >
          Delete
        </button>
      </div>

      <article
        className="relative flex items-center gap-3 bg-white py-3.5 transition"
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <button
          type="button"
          onClick={() => onToggle(task)}
          aria-label={completed ? 'Mark as in progress' : 'Mark as completed'}
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border-[1.8px] transition ${
            completed
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-brand-500 bg-white text-transparent'
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p
          className={`min-w-0 flex-1 truncate text-[15px] font-medium ${
            completed ? 'text-ink-900 line-through decoration-ink-400' : 'text-ink-900'
          }`}
        >
          {task.title}
        </p>

        {showActions && (
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              className="icon-btn"
              aria-label="Delete task"
              onClick={handleDeleteClick}
            >
              <TrashIcon className="h-[15px] w-[15px]" />
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Edit task"
              onClick={() => onEdit(task)}
            >
              <EditIcon className="h-[15px] w-[15px]" />
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
