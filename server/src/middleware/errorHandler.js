const { HTTP_STATUS, MESSAGES } = require('../constants');

function notFoundHandler(_req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: MESSAGES.ROUTE_NOT_FOUND,
  });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION_FAILED,
      errors: Object.values(err.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.INVALID_IDENTIFIER,
    });
  }

  if (err.statusCode === HTTP_STATUS.BAD_REQUEST || err.message === MESSAGES.INVALID_DATE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message || MESSAGES.INVALID_DATE,
    });
  }

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    success: false,
    message: err.message || MESSAGES.INTERNAL_ERROR,
  });
}

module.exports = { notFoundHandler, errorHandler };
