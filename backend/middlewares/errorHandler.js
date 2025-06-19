function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
}

module.exports = errorHandler;
