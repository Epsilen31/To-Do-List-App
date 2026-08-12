import { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ClockIcon, CloseIcon } from '../ui/Icons';
import { emptyTaskForm, taskToFormValues } from '../../utils/dateUtils';
import { TASK_STATUS } from '../../constants';

const INITIAL_ERRORS = {};

function formatDateLabel(dateValue) {
  if (!dateValue) return '';
  try {
    return format(parseISO(dateValue), 'EEEE d, MMMM');
  } catch {
    return dateValue;
  }
}

function FieldLabel({ children }) {
  return <span className="mb-1 block text-[12px] font-normal text-[#8A8A8A]">{children}</span>;
}

function FieldShell({ children, className = '' }) {
  return (
    <div
      className={`relative flex h-[44px] w-full items-center rounded-[6px] border border-[#E3E3E3] bg-white px-3 text-[14px] text-ink-900 ${className}`}
    >
      {children}
    </div>
  );
}

export default function TaskFormModal({
  open,
  mode = 'create',
  task = null,
  defaultDate,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyTaskForm());
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const dateInputRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && task) {
      setForm(taskToFormValues(task));
    } else {
      setForm(
        emptyTaskForm({
          date: defaultDate,
          startTime: '',
          endTime: '',
          priority: '',
        })
      );
    }
    setErrors(INITIAL_ERRORS);
    setApiError('');
  }, [open, mode, task, defaultDate]);

  if (!open) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.date) next.date = 'Date is required';
    if (!form.startTime) next.startTime = 'Start time is required';
    if (form.startTime && form.endTime && form.endTime < form.startTime) {
      next.endTime = 'End time must be after start time';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime || '',
        priority: form.priority || null,
        status: form.status || TASK_STATUS.IN_PROGRESS,
      });
      onClose();
    } catch (error) {
      setApiError(error.message || 'Could not save task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[100%] w-full max-w-phone flex-col overflow-hidden rounded-t-[20px] bg-white px-5 pb-6 pt-5 shadow-sheet">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-[18px] font-bold leading-none text-ink-900">
            {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center text-[#A0A0A0]"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form className="flex shrink-0 flex-col gap-3.5" onSubmit={handleSubmit}>
          <label className="block">
            <FieldLabel>Task title</FieldLabel>
            <FieldShell>
              <input
                className="w-full bg-transparent text-[14px] text-ink-900 outline-none placeholder:text-[#B0B0B0]"
                placeholder="Doing Homework"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
            </FieldShell>
            {errors.title && <p className="mt-1 text-xs text-coral-500">{errors.title}</p>}
          </label>

          <div>
            <FieldLabel>Set Time</FieldLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block text-left">
                <FieldShell className="gap-2">
                  <ClockIcon className="h-4 w-4 shrink-0 text-[#A0A0A0]" />
                  <span className={form.startTime ? 'text-ink-900' : 'text-[#B0B0B0]'}>
                    {form.startTime || 'Start'}
                  </span>
                  <input
                    ref={startInputRef}
                    type="time"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    value={form.startTime}
                    onChange={(event) => updateField('startTime', event.target.value)}
                  />
                </FieldShell>
              </label>
              <label className="block text-left">
                <FieldShell className="gap-2">
                  <ClockIcon className="h-4 w-4 shrink-0 text-[#A0A0A0]" />
                  <span className={form.endTime ? 'text-ink-900' : 'text-[#B0B0B0]'}>
                    {form.endTime || 'Ends'}
                  </span>
                  <input
                    ref={endInputRef}
                    type="time"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    value={form.endTime}
                    onChange={(event) => updateField('endTime', event.target.value)}
                  />
                </FieldShell>
              </label>
            </div>
            {errors.startTime && <p className="mt-1 text-xs text-coral-500">{errors.startTime}</p>}
            {errors.endTime && <p className="mt-1 text-xs text-coral-500">{errors.endTime}</p>}
          </div>

          <div>
            <FieldLabel>Set Date</FieldLabel>
            <label className="block w-full text-left">
              <FieldShell className="justify-between">
                <span className={form.date ? 'text-ink-900' : 'text-[#B0B0B0]'}>
                  {form.date ? formatDateLabel(form.date) : 'Select date'}
                </span>
                <CalendarIcon className="h-4 w-4 text-[#A0A0A0]" />
                <input
                  ref={dateInputRef}
                  type="date"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  value={form.date}
                  onChange={(event) => updateField('date', event.target.value)}
                />
              </FieldShell>
            </label>
            {errors.date && <p className="mt-1 text-xs text-coral-500">{errors.date}</p>}
          </div>

          <label className="block">
            <FieldLabel>Description</FieldLabel>
            <div className="rounded-[6px] border border-[#E3E3E3] bg-white px-3 py-2.5">
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-none bg-transparent text-[14px] text-ink-900 outline-none placeholder:text-[#B0B0B0]"
                placeholder="Add Description"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </div>
          </label>

          {apiError && (
            <p className="rounded-[6px] bg-coral-50 px-3 py-2 text-sm text-coral-600">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-[8px] bg-brand-500 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting
              ? 'Saving...'
              : mode === 'edit'
                ? 'Save changes'
                : 'Create task'}
          </button>
        </form>
      </div>
    </div>
  );
}
