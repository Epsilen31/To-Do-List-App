const mongoose = require('mongoose');
const {
  TASK_STATUS,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_LIMITS,
  TIME_HH_MM_REGEX,
  MESSAGES,
} = require('../constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, MESSAGES.TITLE_REQUIRED],
      trim: true,
      maxlength: [TASK_LIMITS.TITLE_MAX, `Title cannot exceed ${TASK_LIMITS.TITLE_MAX} characters`],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        TASK_LIMITS.DESCRIPTION_MAX,
        `Description cannot exceed ${TASK_LIMITS.DESCRIPTION_MAX} characters`,
      ],
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: [true, MESSAGES.DATE_TIME_REQUIRED],
      index: true,
    },
    endTime: {
      type: String,
      default: '',
      match: [TIME_HH_MM_REGEX, MESSAGES.END_TIME_FORMAT],
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}`,
      },
      required: false,
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: `Status must be one of: ${TASK_STATUSES.join(', ')}`,
      },
      default: TASK_STATUS.IN_PROGRESS,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

taskSchema.virtual('isCompleted').get(function isCompleted() {
  return this.status === TASK_STATUS.COMPLETED;
});

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };
