const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library')
const randomstring = require('randomstring');
const router = express.Router();
require('dotenv').config();

const validate = require('../middlewares/validate.mdw');
const authSchema = require('../schemas/auth.json');
const authGoogleSchema = require('../schemas/auth_google.json');
const tokenSchema = require('../schemas/token.json');
const userModel = require('../models/user.model');
const handleToken = require('../utils/token');

//login
router.post('/', validate(authSchema), async (req, res) => {
  const user = await userModel.findByUserName(req.body.username);
  if (user === null) {
    return res.status(400).json({
      authenticated: false
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).json({
      authenticated: false
    });
  }

  if (!user.active) {
    return res.status(400).json({
      authenticated: false
    });
  }

  let {
    authenticated,
    accessToken,
    refreshToken
  } = await handleToken.token(user)
  return res.status(200).json({
    authenticated,
    accessToken,
    refreshToken
  });

});

//login google
router.post('/google', validate(authGoogleSchema), async (req, res) => {
  const { tokenId } = req.body;

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  let { email, sub, name, picture } = ticket.getPayload();
  let resToken = {};

  let user = await userModel.find({ email });
  // user new -> creat
  if (user === null) {
    let password = bcrypt.hashSync(randomstring.generate(10), 10);
    let info = {
      username: email,
      password,
      email,
      role: 'user',
      full_name: name,
      ggid: sub,
      active: true
    }
    let id = await userModel.add(info);
    resToken = await handleToken.token({ ...info, id });
    //user old -> update
  } else if (user.ggid === '') {
    await userModel.update({ id: user.id }, { ggid: sub });
    resToken = await handleToken.token({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    });
    // user invalid
  } else if (user.ggid !== '' && user.ggid !== sub) {
    return res.status(400).json({
      authenticated: false
    });
    // user valid
  } else {
    resToken = await handleToken.token(user)
  }

  return res.status(200).json(resToken);
});

router.post('/refresh', validate(tokenSchema), async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  const { userId, role, userName, fullName } = jwt.verify(
    accessToken,
    process.env.SECRET_KEY,
    { ignoreExpiration: true }
  );

  const ret = await userModel.isValidRefreshToken(userId, refreshToken);
  if (ret === true) {
    const newAccessToken = jwt.sign(
      {
        userId,
        userName,
        fullName,
        role
      },
      process.env.SECRET_KEY,
      { expiresIn: 1 * 60 }, // 1 min
      { algorithm: 'HS256' }
    );

    return res.status(200).json({
      accessToken: newAccessToken
    });
  }

  return res.status(401).json({
    type: 'invalid_refresh_token',
    message: 'Invalid refresh token!'
  });

})

module.exports = router;