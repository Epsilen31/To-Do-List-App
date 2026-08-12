import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import SearchBar from '../components/ui/SearchBar';
import TaskList from '../components/home/TaskList';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { BackIcon } from '../components/ui/Icons';
import { useTasks } from '../context/TaskContext';
import { getErrorMessage } from '../api/taskApi';
import { SEARCH_DEBOUNCE_MS, UI_LIMITS } from '../constants';

export default function SearchPage() {
  const navigate = useNavigate();
  const { tasks, searchTasks, updateTask, toggleTaskStatus, deleteTask } = useTasks();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const lowered = debouncedQuery.toLowerCase();
    setResults(
      tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowered) ||
          (task.description || '').toLowerCase().includes(lowered)
      )
    );
  }, [debouncedQuery, tasks]);

  useEffect(() => {
    if (!debouncedQuery) {
      setLoading(false);
      setError('');
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    const timer = setTimeout(async () => {
      try {
        const data = await searchTasks(debouncedQuery);
        if (active) setResults(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [debouncedQuery, searchTasks]);

  async function handleSubmit(payload) {
    try {
      await updateTask(editingTask.id, payload);
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

  const visibleResults = results.slice(0, UI_LIMITS.SEARCH_RESULTS);
  const hasMore = results.length > UI_LIMITS.SEARCH_RESULTS;

  return (
    <MobileShell className="flex flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5 pt-5">
        <button
          type="button"
          className="mb-4 -ml-1 shrink-0 p-1 text-ink-900"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <BackIcon className="h-5 w-5" />
        </button>

        <div className="shrink-0">
          <SearchBar
            value={query}
            onChange={setQuery}
            autoFocus
            placeholder="Search for a task"
          />
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden">
          {(error || actionError) && (
            <p className="mb-3 rounded-md bg-coral-50 px-3 py-2 text-sm text-coral-600">
              {actionError || error}
            </p>
          )}

          {!debouncedQuery && (
            <p className="px-0.5 text-sm text-ink-400">Search by title or description.</p>
          )}

          {debouncedQuery && (
            <>
              {loading && (
                <p className="mb-2 text-sm text-ink-400">Searching...</p>
              )}
              <TaskList
                tasks={visibleResults}
                onToggle={handleToggle}
                onEdit={(item) => {
                  setEditingTask(item);
                  setModalOpen(true);
                }}
                onDelete={handleDelete}
                showActions
                emptyMessage={`No tasks match “${debouncedQuery}”`}
              />
              {hasMore && (
                <p className="mt-2 text-xs text-ink-400">
                  Showing {UI_LIMITS.SEARCH_RESULTS} of {results.length} matches
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <TaskFormModal
        open={modalOpen}
        mode="edit"
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </MobileShell>
  );
}
