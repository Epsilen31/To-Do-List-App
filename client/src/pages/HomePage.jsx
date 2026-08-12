import { useMemo, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import SearchBar from '../components/ui/SearchBar';
import FabButton from '../components/ui/FabButton';
import DateStrip from '../components/home/DateStrip';
import StatCards from '../components/home/StatCards';
import WeeklyProgress from '../components/home/WeeklyProgress';
import TaskList from '../components/home/TaskList';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { useTasks } from '../context/TaskContext';
import { filterTasksForDate, toDateInputValue } from '../utils/dateUtils';
import { getErrorMessage } from '../api/taskApi';
import { UI_LIMITS } from '../constants';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    tasks,
    weeklyOverview,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [actionError, setActionError] = useState('');

  const allDayTasks = useMemo(
    () => filterTasksForDate(tasks, selectedDate),
    [tasks, selectedDate]
  );

  const dayTasks = allDayTasks.slice(0, UI_LIMITS.HOME_TASKS);
  const hasMoreDayTasks = allDayTasks.length > UI_LIMITS.HOME_TASKS;

  const thisWeek = weeklyOverview.thisWeek || {
    openCount: 0,
    completedCount: 0,
    total: 0,
  };

  const tasksHeading = isSameDay(selectedDate, new Date())
    ? 'Tasks Today'
    : `Tasks · ${format(selectedDate, 'MMM d')}`;

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(payload) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function handleToggle(task) {
    try {
      setActionError('');
      await toggleTaskStatus(task);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDelete(id) {
    try {
      setActionError('');
      await deleteTask(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <MobileShell className="flex flex-col bg-white">
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden px-5 pb-20 pt-5">
        <button type="button" className="w-full shrink-0 text-left" onClick={() => navigate('/search')}>
          <SearchBar value="" onChange={() => {}} readOnly placeholder="Search for a task" />
        </button>

        <div className="shrink-0">
          <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div className="shrink-0">
          <StatCards completed={thisWeek.completedCount} pending={thisWeek.openCount} />
        </div>

        <div className="shrink-0">
          <WeeklyProgress completed={thisWeek.completedCount} total={thisWeek.total} />
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="mb-1.5 flex shrink-0 items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink-900">{tasksHeading}</h2>
            <Link to="/weeks" className="text-[13px] font-medium text-brand-500">
              View All
            </Link>
          </div>

          {(error || actionError) && (
            <p className="mb-2 shrink-0 rounded-md bg-coral-50 px-3 py-2 text-sm text-coral-600">
              {actionError || error}
            </p>
          )}

          <div className="min-h-0 flex-1 overflow-hidden">
            {loading ? (
              <div className="border-t border-ink-200 py-8 text-center text-sm text-ink-400">
                Loading tasks...
              </div>
            ) : (
              <>
                <TaskList
                  tasks={dayTasks}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  emptyMessage="No tasks scheduled for this day"
                />
                {hasMoreDayTasks && (
                  <p className="mt-2 text-xs text-ink-400">
                    Showing {UI_LIMITS.HOME_TASKS} of {allDayTasks.length} · View All for weekly list
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <FabButton onClick={openCreate} />

      <TaskFormModal
        open={modalOpen}
        mode={editingTask ? 'edit' : 'create'}
        task={editingTask}
        defaultDate={toDateInputValue(selectedDate)}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </MobileShell>
  );
}
