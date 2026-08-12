import TaskItem from '../tasks/TaskItem';

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  emptyMessage = 'No tasks for this day',
  showActions = true,
}) {
  if (!tasks.length) {
    return (
      <div className="border-t border-ink-200 py-10 text-center">
        <p className="text-sm text-ink-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink-200 border-t border-ink-200">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
