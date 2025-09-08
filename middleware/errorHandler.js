function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Server error';
  return res.status(status).json({ error: message });
}

module.exports = errorHandler;

