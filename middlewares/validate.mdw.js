const Ajv = require("ajv").default

module.exports = (schema) => {
  return (req, res, next) => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema)
    const valid = validate(req.body)
    if (!valid) {
      return res.status(400).json(validate.errors);
    }

    next();
  }
}