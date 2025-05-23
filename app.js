// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Add error handler middleware (should be last)
app.use(errorHandler); 