export const notFound = (request, response) => {
  response.status(404).json({ error: `Route ${request.method} ${request.originalUrl} not found` });
};

export const errorHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : "Internal server error" });
};
