const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (roles = ['user']) => {
  return (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
        if (roles.includes(decoded.role)) {
          req.accessTokenPayload = decoded;
          next();
        } else {
          return res.status(403).json({
            type: 'permission_denied',
            message: 'Permission denied!'
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(401).json({
          type: 'invalid_token',
          message: 'Token invalid.'
        });
      }
    } else {
      return res.status(401).json({
        type: 'invalid_token',
        message: 'Token not found.'
      });
    }
  }
}