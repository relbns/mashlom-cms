const { StatusCodes } = require('http-status-codes');
const { isProd } = require('../../utils/helpers');

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === StatusCodes.OK ? StatusCodes.INTERNAL_SERVER_ERROR : res.statusCode;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = StatusCodes.NOT_FOUND;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    stack: isProd ? undefined : err.stack,
  });
};

module.exports = { notFoundHandler, errorHandler };
