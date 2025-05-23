const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // If headers are already sent, let the default Express error handler deal with it
  if (res.headersSent) {
    return next(err);
  }

  // Handle 404 errors - use existing 404 page
  if (err.status === 404 || err.name === 'NotFoundError') {
    return res.status(404).render('pages/404', {
      userType: req.session?.type,
      name: req.session?.name,
    });
  }

  // Handle all other errors with the error page
  const status = err.status || 500;
  const errorMessage =
    err.name === 'ValidationError'
      ? err.message
      : process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred';

  res.status(status).render('pages/error', {
    error: errorMessage,
    userType: req.session?.type,
    name: req.session?.name,
    backUrl: req.headers.referer || '/',
  });
};

module.exports = errorHandler;
