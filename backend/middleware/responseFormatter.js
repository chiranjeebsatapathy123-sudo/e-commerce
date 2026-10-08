const formatResponse = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (body && typeof body === 'object' && body.success !== undefined) {
      // Already formatted (e.g. from error handler or explicitly formatted endpoint)
      return originalJson.call(this, body);
    }
    
    if (res.statusCode >= 400) {
      return originalJson.call(this, {
        success: false,
        error: {
          code: body.code || 'API_ERROR',
          message: body.message || 'An error occurred',
          details: body.details || body
        }
      });
    }

    return originalJson.call(this, {
      success: true,
      data: body
    });
  };
  next();
};

module.exports = { formatResponse };
