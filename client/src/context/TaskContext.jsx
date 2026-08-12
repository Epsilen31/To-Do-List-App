import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { taskApi, getErrorMessage } from '../api/taskApi';
import { buildWeeklyOverview } from '../utils/dateUtils';
import { TASK_STATUS } from '../constants';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const listVersionRef = useRef(0);

  const weeklyOverview = useMemo(() => buildWeeklyOverview(tasks), [tasks]);

  const syncTasks = useCallback((updater) => {
    listVersionRef.current += 1;
    setTasks((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const refresh = useCallback(async () => {
    const versionAtStart = listVersionRef.current;
    setLoading(true);
    setError('');
    try {
      const taskList = await taskApi.list();
      if (versionAtStart === listVersionRef.current) {
        setTasks(taskList);
      }
    } catch (err) {
      if (versionAtStart === listVersionRef.current) {
        setError(getErrorMessage(err, 'Unable to load tasks'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = useCallback(async (payload) => {
    const created = await taskApi.create(payload);
    syncTasks((prev) => [...prev, created]);
    return created;
  }, [syncTasks]);

  const updateTask = useCallback(async (id, payload) => {
    const updated = await taskApi.update(id, payload);
    syncTasks((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, [syncTasks]);

  const toggleTaskStatus = useCallback(async (task) => {
    const nextStatus =
      task.status === TASK_STATUS.COMPLETED
        ? TASK_STATUS.IN_PROGRESS
        : TASK_STATUS.COMPLETED;
    const updated = await taskApi.updateStatus(task.id, nextStatus);
    syncTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
    return updated;
  }, [syncTasks]);

  const deleteTask = useCallback(async (id) => {
    await taskApi.remove(id);
    syncTasks((prev) => prev.filter((item) => item.id !== id));
  }, [syncTasks]);

  const searchTasks = useCallback(async (search) => taskApi.list({ search }), []);

  const value = useMemo(
    () => ({
      tasks,
      weeklyOverview,
      loading,
      error,
      selectedDate,
      setSelectedDate,
      refresh,
      createTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      searchTasks,
    }),
    [
      tasks,
      weeklyOverview,
      loading,
      error,
      selectedDate,
      refresh,
      createTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      searchTasks,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
