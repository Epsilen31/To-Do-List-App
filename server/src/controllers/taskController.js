const { Task } = require('../models/Task');
const {
  startOfDay,
  endOfDay,
  getWeekBounds,
  buildDateFromParts,
  parseLocalDateOnly,
} = require('../utils/weekHelpers');
const { TASK_STATUS, HTTP_STATUS, MESSAGES } = require('../constants');

function notFound(res) {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.TASK_NOT_FOUND,
  });
}

function mapCreatePayload(body) {
  const {
    title,
    description = '',
    date,
    startTime,
    endTime = '',
    priority,
    status = TASK_STATUS.IN_PROGRESS,
  } = body;

  const payload = {
    title: title.trim(),
    description: description?.trim?.() || '',
    scheduledAt: buildDateFromParts(date, startTime),
    endTime: endTime || '',
    status,
  };

  if (priority) {
    payload.priority = priority;
  }

  return payload;
}

function mapUpdatePayload(body) {
  const { title, description, date, startTime, endTime, priority, status } = body;

  const payload = {
    title: title.trim(),
    scheduledAt: buildDateFromParts(date, startTime),
  };

  if (description !== undefined) {
    payload.description = description?.trim?.() || '';
  }
  if (endTime !== undefined) {
    payload.endTime = endTime || '';
  }
  if (status !== undefined) {
    payload.status = status;
  }

  if (priority) {
    payload.priority = priority;
  } else if (priority === null || priority === '') {
    payload.$unset = { priority: 1 };
  }

  return payload;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listTasks(req, res, next) {
  try {
    const { search, date, weekStart, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const day = parseLocalDateOnly(date) || new Date(date);
      filter.scheduledAt = {
        $gte: startOfDay(day),
        $lte: endOfDay(day),
      };
    } else if (weekStart) {
      const weekAnchor = parseLocalDateOnly(weekStart) || new Date(weekStart);
      const bounds = getWeekBounds(weekAnchor);
      filter.scheduledAt = {
        $gte: bounds.weekStart,
        $lte: bounds.weekEnd,
      };
    }

    if (search && search.trim()) {
      const term = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ scheduledAt: 1, createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return notFound(res);
    return res.json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await Task.create(mapCreatePayload(req.body));

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const update = mapUpdatePayload(req.body);

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) return notFound(res);

    return res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!task) return notFound(res);

    return res.json({
      success: true,
      message: 'Task status updated',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return notFound(res);

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
