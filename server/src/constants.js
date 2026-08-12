const TASK_STATUS = Object.freeze({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

const TASK_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

const TASK_STATUSES = Object.freeze(Object.values(TASK_STATUS));
const TASK_PRIORITIES = Object.freeze(Object.values(TASK_PRIORITY));

const TASK_LIMITS = Object.freeze({
  TITLE_MAX: 120,
  DESCRIPTION_MAX: 1000,
});

const TIME_HH_MM_REGEX = /^$|^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_HH_MM_REQUIRED_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const SERVER = Object.freeze({
  DEFAULT_PORT: 5000,
  DEFAULT_CLIENT_URL: 'http://localhost:5173',
  MONGO_SERVER_SELECTION_TIMEOUT_MS: 15000,
});

const HTTP_STATUS = Object.freeze({
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

const MESSAGES = Object.freeze({
  VALIDATION_FAILED: 'Validation failed',
  TASK_NOT_FOUND: 'Task not found',
  ROUTE_NOT_FOUND: 'Route not found',
  INVALID_IDENTIFIER: 'Invalid identifier',
  INTERNAL_ERROR: 'Internal server error',
  API_RUNNING: 'To-Do List API is running',
  TITLE_REQUIRED: 'Title is required',
  DATE_REQUIRED: 'Date is required',
  START_TIME_REQUIRED: 'Start time is required',
  STATUS_REQUIRED: 'Status is required',
  INVALID_TASK_ID: 'Invalid task id',
  INVALID_DATE: 'Invalid date',
  DATE_TIME_REQUIRED: 'Date and time are required',
  END_TIME_FORMAT: 'End time must be HH:mm',
  START_TIME_FORMAT: 'Start time must be HH:mm',
  DATE_ISO: 'Date must be a valid ISO date',
  END_BEFORE_START: 'End time must be after start time',
});

module.exports = {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_LIMITS,
  TIME_HH_MM_REGEX,
  TIME_HH_MM_REQUIRED_REGEX,
  SERVER,
  HTTP_STATUS,
  MESSAGES,
};
