const express = require('express');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const router = express.Router();

const auth = require('../middlewares/auth.mdw');
const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');
const changePwSchema = require('../schemas/change-pw.json');
const userInfoSchema = require('../schemas/user_info.json');
const userModel = require('../models/user.model');
const codeMailModel = require('../models/code_email.model');
const mailer = require('../utils/mailer');

//register
router.post('/', validate(userSchema), async (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.role = 'user';
  // user.id = await userModel.add(user);

  let code = randomstring.generate(20);
  let id = await codeMailModel.add({ code });

  let optionMail = {
    mailsTo: 'nlcthong1997@gmail.com',//user.email,
    subject: 'Online-Academy: Kích hoạt tài khoản.',
    fileTemplateEmail: 'templates/emails/register_confirm.html'
  }
  await mailer.sendMail(optionMail);

  delete user.password;
  res.status(201).json(user);
});

//active account
router.get('/active-account/:code', (req, res) => {
  let code = req.params.code;
  // let isValid = codeMailModel.isValidateCode(code);
  // if (isValid) {
  //   //update active code_mail
  // }
  console.log('code: ', code);
  return;
});

//update ignore password
router.put('/', auth, validate(userInfoSchema), async (req, res) => {
  const { userId } = req.accessTokenPayload;
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
  const { userId } = req.accessTokenPayload;
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