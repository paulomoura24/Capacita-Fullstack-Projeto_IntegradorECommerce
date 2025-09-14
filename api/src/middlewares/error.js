export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: { message, code: err.code || 'INTERNAL_ERROR', details: err.details || null }
  });
}
