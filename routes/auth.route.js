const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const router = express.Router();
require('dotenv').config();

const validate = require('../middlewares/validate.mdw');
const authSchema = require('../schemas/auth.json');
const tokenSchema = require('../schemas/token.json');
const userModel = require('../models/user.model');

router.post('/', validate(authSchema), async (req, res) => {
  const user = await userModel.findByUserName(req.body.username);
  if (user === null) {
    return res.json({
      authenticated: false
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: 2 * 60 },
    { algorithm: 'HS256' }
  );

  const refreshToken = randomstring.generate();
  await userModel.updateRefreshToken(user.id, refreshToken);

  return res.status(200).json({
    authenticated: true,
    accessToken,
    refreshToken
  });

});

router.post('/refresh', validate(tokenSchema), async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  const { userId, role } = jwt.verify(
    accessToken, 
    process.env.SECRET_KEY,
    { ignoreExpiration: true }
  );

  const ret = await userModel.isValidRefreshToken(userId, refreshToken);
  if (ret === true) {
    const newAccessToken = jwt.sign(
      {
        userId: userId,
        role: role,
      },
      process.env.SECRET_KEY,
      { expiresIn: 2 * 60 },
      { algorithm: 'HS256' }
    );

    return res.status(200).json({
      accessToken: newAccessToken
    });
  } 

  return res.status(400).json({
    message: 'Invalid refresh token!'
  });

})

module.exports = router;