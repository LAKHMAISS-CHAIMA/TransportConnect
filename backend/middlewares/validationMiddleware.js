const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true, 
    });
    next();
  } catch (error) {
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    res.status(400).json({ message: "Données invalides", errors });
  }
};

module.exports = validate;
