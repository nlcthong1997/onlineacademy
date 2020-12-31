module.exports = (roles = ['user']) => {
  return (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
        if (roles.includes(decoded.role)) {
          req.accessTokenPayload = decoded;
          next();
        } else {
          return res.status(401).json({
            message: 'Permission denied!'
          });
        }
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
}