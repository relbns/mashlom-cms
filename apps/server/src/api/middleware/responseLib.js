const { StatusCodes } = require('http-status-codes');

const responseLib = (req, res, next) => {
  const buildResponse = (statusCode, body) => res.status(statusCode).json(typeof body === 'string' ? { msg: body } : body);

  res.success = (body) => buildResponse(StatusCodes.OK, body); // 200
  res.created = (body) => buildResponse(StatusCodes.CREATED, body); // 201
  res.accepted = (body) => buildResponse(StatusCodes.ACCEPTED, body); // 202
  res.noContent = (body) => buildResponse(StatusCodes.NO_CONTENT, body); // 204
  res.badRequest = (body) => buildResponse(StatusCodes.BAD_REQUEST, body); // 400
  res.unauthorized = (body) => buildResponse(StatusCodes.UNAUTHORIZED, body); // 401
  res.forbidden = (body) => buildResponse(StatusCodes.FORBIDDEN, body); // 403
  res.notFound = (body) => buildResponse(StatusCodes.NOT_FOUND, body); // 404
  res.failure = (body = { status: false }) => buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, body); // 500
  res.custom = (statusCode, body) => buildResponse(statusCode, body);

  next();
};

module.exports = responseLib;
