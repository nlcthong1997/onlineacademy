const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const userModel = require('../models/user.model');
require('dotenv').config();

module.exports = {
  token: async (user) => {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        userName: user.username,
        fullName: user.full_name,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: 5 * 60 }, // 5 min
      { algorithm: 'HS256' }
    );

    const refreshToken = randomstring.generate();
    await userModel.updateRefreshToken(user.id, refreshToken);

    return {
      authenticated: true,
      accessToken,
      refreshToken
    };
  }
}