import {
  addDays,
  endOfDay,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { TASK_STATUS } from '../constants';

export function toDateInputValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, 'yyyy-MM-dd');
}

export function toTimeInputValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, 'HH:mm');
}

export function getCalendarStrip(referenceDate = new Date()) {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function isTaskOnDate(task, date) {
  if (!task?.scheduledAt) return false;
  return isSameDay(parseISO(task.scheduledAt), date);
}

export function filterTasksForDate(tasks, date) {
  return tasks.filter((task) => isTaskOnDate(task, date));
}

export function emptyTaskForm(defaults = {}) {
  const now = defaults.date ? new Date(defaults.date) : new Date();
  return {
    title: '',
    description: '',
    date: toDateInputValue(now),
    startTime: '',
    endTime: '',
    priority: '',
    status: TASK_STATUS.IN_PROGRESS,
    ...defaults,
  };
}

export function taskToFormValues(task) {
  return {
    title: task.title || '',
    description: task.description || '',
    date: toDateInputValue(task.scheduledAt),
    startTime: toTimeInputValue(task.scheduledAt),
    endTime: task.endTime || '',
    priority: task.priority || '',
    status: task.status || TASK_STATUS.IN_PROGRESS,
  };
}

export function progressPercent(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

function toLocalDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekBounds(referenceDate = new Date()) {
  const date = startOfDay(referenceDate instanceof Date ? referenceDate : new Date(referenceDate));
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysFromMonday);
  const weekEnd = endOfDay(addDays(weekStart, 6));
  return { weekStart, weekEnd };
}

export function buildWeeklyOverview(tasks = [], referenceDate = new Date()) {
  const currentWeek = getWeekBounds(referenceDate);
  const weekMap = new Map();

  for (const task of tasks) {
    const scheduled = new Date(task.scheduledAt);
    const bounds = getWeekBounds(scheduled);
    const key = toLocalDateKey(bounds.weekStart);

    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekKey: key,
        weekStart: bounds.weekStart,
        weekEnd: bounds.weekEnd,
        label: `${format(bounds.weekStart, 'MMM d')} – ${format(bounds.weekEnd, 'MMM d, yyyy')}`,
        openCount: 0,
        completedCount: 0,
        tasks: [],
      });
    }

    const bucket = weekMap.get(key);
    bucket.tasks.push(task);
    if (task.status === TASK_STATUS.COMPLETED) bucket.completedCount += 1;
    else bucket.openCount += 1;
  }

  const weeks = Array.from(weekMap.values()).sort(
    (a, b) => new Date(b.weekStart) - new Date(a.weekStart)
  );

  const thisWeekBucket = weekMap.get(toLocalDateKey(currentWeek.weekStart));

  return {
    thisWeek: {
      weekKey: toLocalDateKey(currentWeek.weekStart),
      weekStart: currentWeek.weekStart,
      weekEnd: currentWeek.weekEnd,
      label: `${format(currentWeek.weekStart, 'MMM d')} – ${format(currentWeek.weekEnd, 'MMM d, yyyy')}`,
      openCount: thisWeekBucket?.openCount || 0,
      completedCount: thisWeekBucket?.completedCount || 0,
      total: thisWeekBucket?.tasks.length || 0,
    },
    weeks,
  };
}
