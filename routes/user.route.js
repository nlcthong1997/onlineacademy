const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const auth = require('../middlewares/auth.mdw');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');
const changePwSchema = require('../schemas/change-pw.json');
const userInfoSchema = require('../schemas/user-info.json');
const userModel = require('../models/user.model');

//register
router.post('/', validate(userSchema), async (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.id = await userModel.add(user);
  delete user.password;
  res.status(201).json(user);
});

//update ignore password
router.put('/', auth, validate(userInfoSchema), async (req, res) => {
  const { userId, role } = req.accessTokenPayload;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Missing data!'
    });
  }

  await userModel.update(userId, req.body);
  return res.status(200).json({
    message: 'Update successfully.'
  });
});

//change password
router.put('/change-password', auth, validate(changePwSchema), async (req, res) => {
  const { password, confirm_password } = req.body;
  const { userId, role } = req.accessTokenPayload;
  if (password !== confirm_password) {
    return res.status(400).json({
      message: 'Compare password invalid!'
    });
  }
  password = bcrypt.hashSync(password, 10);
  await userModel.updatePassword(userId, password);

  return res.status(200).json({
    message: 'Change password successfully.'
  });
});



module.exports = router;