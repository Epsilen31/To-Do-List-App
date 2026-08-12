/**
 * Weeks run Monday (start of day) through Sunday (end of day).
 * Date-only strings (yyyy-MM-dd) are always interpreted in local time.
 */

const { MESSAGES } = require('../constants');

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function parseLocalDateOnly(dateValue) {
  const dateStr = String(dateValue).slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function getWeekBounds(referenceDate = new Date()) {
  const date = startOfDay(referenceDate);
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysFromMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

function buildDateFromParts(dateValue, timeValue = '00:00') {
  const base = parseLocalDateOnly(dateValue);
  if (!base) {
    const error = new Error(MESSAGES.INVALID_DATE);
    error.statusCode = 400;
    throw error;
  }

  const [hours = '0', minutes = '0'] = String(timeValue).split(':');
  base.setHours(Number(hours), Number(minutes), 0, 0);
  return base;
}

module.exports = {
  startOfDay,
  endOfDay,
  parseLocalDateOnly,
  getWeekBounds,
  buildDateFromParts,
};
