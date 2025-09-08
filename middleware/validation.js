function validate(schema) {
  return (req, res, next) => {
    const options = { abortEarly: false, allowUnknown: false, stripUnknown: true };
    const payload = { body: req.body, params: req.params, query: req.query };
    const { value, error } = schema.validate(payload, options);
    if (error) {
      return res.status(400).json({ error: error.details.map((d) => d.message).join(', ') });
    }
    req.body = value.body || req.body;
    req.params = value.params || req.params;
    req.query = value.query || req.query;
    return next();
  };
}

module.exports = validate;

