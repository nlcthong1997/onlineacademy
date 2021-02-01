const express = require('express');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const router = express.Router();
require('dotenv').config();

const auth = require('../middlewares/auth.mdw');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');
const changePwSchema = require('../schemas/change-pw.json');
const userInfoSchema = require('../schemas/user_info.json');
const userModel = require('../models/user.model');
const codeMailModel = require('../models/code_email.model');
const mailer = require('../utils/mailer');

router.get('/info', auth, async (req, res) => {
  let payload = req.accessTokenPayload;
  let user = await userModel.findById(payload.userId);
  if (user === null) {
    return res.status(400); //user not exist => client logout => return status error 400
  }
  delete user.password;
  delete user.ggid;
  delete user.active;
  delete user.refresh_token;

  return res.status(200).json(user);
});

//register
router.post('/', validate(userSchema), async (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.role = 'user';
  user.id = await userModel.add(user);

  let code = randomstring.generate(20);
  let id = await codeMailModel.add({ code });

  let optionMail = {
    mailsTo: user.email,
    subject: 'Online-Academy: Kích hoạt tài khoản.',
    fileTemplate: '/emails/register_confirm.html',
    replacements: {
      link: `${process.env.APP_BASE_URL}/users/active-account/${id}/${user.id}/${code}`
    }
  }
  await mailer.sendMail(optionMail);
  delete user.password;
  res.status(201).json(user);
});

//active account
router.get('/active-account/:codeId(\\d+)/:userId(\\d+)/:code', async (req, res) => {
  let code = req.params.code;
  let userId = req.params.userId;
  let isValid = await codeMailModel.isValidateCode(code);
  if (isValid) {
    await userModel.update({ id: userId }, { active: true });
    await codeMailModel.update({ code }, { is_available: false });
  }
  return res.redirect(`${process.env.CLIENT_BASE_URL}/login`)
});

//update ignore password
router.put('/', auth, validate(userInfoSchema), async (req, res) => {
  const { userId } = req.accessTokenPayload;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Missing data!'
    });
  }

  await userModel.update({ id: userId }, req.body);
  return res.status(201).json({
    message: 'Update successfully.'
  });
});

//change password
router.put('/change-password', auth, validate(changePwSchema), async (req, res) => {
  const { password, confirm_password } = req.body;
  const { userId } = req.accessTokenPayload;
  if (password !== confirm_password) {
    return res.status(400).json({
      message: 'Compare password invalid!'
    });
  }
  password = bcrypt.hashSync(password, 10);
  await userModel.updatePassword(userId, password);

  return res.status(201).json({
    message: 'Change password successfully.'
  });
});

module.exports = router;