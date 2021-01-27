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
    return res.json({
      authenticated: false
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false
    });
  }

  if (!user.active) {
    return res.json({
      authenticated: false
    });
  }

  // const accessToken = jwt.sign(
  //   {
  //     userId: user.id,
  //     userName: user.username,
  //     fullName: user.full_name,
  //     role: user.role,
  //   },
  //   process.env.SECRET_KEY,
  //   { expiresIn: 5 * 60 }, // 5 min
  //   { algorithm: 'HS256' }
  // );

  // const refreshToken = randomstring.generate();
  // await userModel.updateRefreshToken(user.id, refreshToken);

  // return res.status(200).json({
  //   authenticated: true,
  //   accessToken,
  //   refreshToken
  // });
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
  if (user === null) {
    let password = bcrypt.hashSync(randomstring.generate(10), 10);
    let info = {
      username: email,
      password,
      email,
      role: 'user',
      full_name: name,
      ggid: sub,
    }
    await userModel.add(info);
    resToken = await handleToken.token(info);

  } else if (user.ggid === '') {
    await userModel.update({ id: user.id }, { ggid: sub });
    resToken = await handleToken.token({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    });

  } else if (user.ggid !== '' && user.ggid !== sub) {
    return res.json({
      authenticated: false
    });

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
      { expiresIn: 5 * 60 }, // 5 min
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