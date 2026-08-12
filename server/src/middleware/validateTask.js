const { body, param, query, validationResult } = require('express-validator');
const {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_LIMITS,
  TIME_HH_MM_REQUIRED_REGEX,
  HTTP_STATUS,
  MESSAGES,
} = require('../constants');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION_FAILED,
      errors: errors.array().map((item) => ({
        field: item.path,
        message: item.msg,
      })),
    });
  }
  return next();
}

const taskBodyRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.TITLE_REQUIRED)
    .isLength({ max: TASK_LIMITS.TITLE_MAX })
    .withMessage(`Title cannot exceed ${TASK_LIMITS.TITLE_MAX} characters`),
  body('description')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: TASK_LIMITS.DESCRIPTION_MAX })
    .withMessage(`Description cannot exceed ${TASK_LIMITS.DESCRIPTION_MAX} characters`),
  body('date')
    .notEmpty()
    .withMessage(MESSAGES.DATE_REQUIRED)
    .isISO8601()
    .withMessage(MESSAGES.DATE_ISO),
  body('startTime')
    .notEmpty()
    .withMessage(MESSAGES.START_TIME_REQUIRED)
    .matches(TIME_HH_MM_REQUIRED_REGEX)
    .withMessage(MESSAGES.START_TIME_FORMAT),
  body('endTime')
    .optional({ nullable: true, checkFalsy: true })
    .matches(TIME_HH_MM_REQUIRED_REGEX)
    .withMessage(MESSAGES.END_TIME_FORMAT),
  body('priority')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  body().custom((value) => {
    const { startTime, endTime } = value || {};
    if (startTime && endTime && endTime < startTime) {
      throw new Error(MESSAGES.END_BEFORE_START);
    }
    return true;
  }),
];

const createTaskValidator = [...taskBodyRules, handleValidation];

const updateTaskValidator = [
  param('id').isMongoId().withMessage(MESSAGES.INVALID_TASK_ID),
  ...taskBodyRules,
  handleValidation,
];

const statusValidator = [
  param('id').isMongoId().withMessage(MESSAGES.INVALID_TASK_ID),
  body('status')
    .notEmpty()
    .withMessage(MESSAGES.STATUS_REQUIRED)
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  handleValidation,
];

const idParamValidator = [
  param('id').isMongoId().withMessage(MESSAGES.INVALID_TASK_ID),
  handleValidation,
];

const listQueryValidator = [
  query('search').optional().isString(),
  query('date').optional().isISO8601().withMessage('date must be ISO8601'),
  query('weekStart').optional().isISO8601().withMessage('weekStart must be ISO8601'),
  query('status').optional().isIn(TASK_STATUSES),
  handleValidation,
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  statusValidator,
  idParamValidator,
  listQueryValidator,
};
