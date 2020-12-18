const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
      req.accessTokenPayload = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Token invalid.'
      });
    }
  } else {
    return res.status(401).json({
      message: 'Token not found.'
    });
  }
}