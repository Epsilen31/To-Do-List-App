import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import WeekCards from '../components/home/WeekCards';
import TaskFormModal from '../components/tasks/TaskFormModal';
import FabButton from '../components/ui/FabButton';
import { BackIcon } from '../components/ui/Icons';
import { useTasks } from '../context/TaskContext';
import { getErrorMessage } from '../api/taskApi';
import { toDateInputValue } from '../utils/dateUtils';
import { UI_LIMITS } from '../constants';

export default function WeeksPage() {
  const navigate = useNavigate();
  const {
    weeklyOverview,
    loading,
    error,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    selectedDate,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [actionError, setActionError] = useState('');

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

  const thisWeekKey = weeklyOverview.thisWeek?.weekKey || null;

  return (
    <MobileShell className="flex flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-20 pt-5">
        <div className="mb-4 flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="-ml-1 p-1 text-ink-900"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <BackIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[17px] font-bold text-ink-900">Weekly Tasks</h1>
            <p className="text-[11px] text-ink-400">Weeks start Monday · end Sunday</p>
          </div>
        </div>

        {(error || actionError) && (
          <p className="mb-3 shrink-0 rounded-md bg-coral-50 px-3 py-2 text-sm text-coral-600">
            {actionError || error}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-hidden">
          {loading ? (
            <div className="border-t border-ink-200 py-10 text-center text-sm text-ink-400">
              Loading weeks...
            </div>
          ) : (
            <WeekCards
              weeks={(weeklyOverview.weeks || []).slice(0, UI_LIMITS.WEEK_CARDS)}
              initiallyExpandedKey={thisWeekKey}
              onToggle={handleToggle}
              onEdit={(task) => {
                setEditingTask(task);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <FabButton
        onClick={() => {
          setEditingTask(null);
          setModalOpen(true);
        }}
      />

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
