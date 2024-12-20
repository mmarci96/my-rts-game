class BadRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = statusCode;
  }
}

module.exports = BadRequestError;

