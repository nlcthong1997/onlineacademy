const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const validate = require('../middlewares/validate.mdw');
const userSchema = require('../schemas/user.json');
const userModel = require('../models/user.model');

router.post('/', validate(userSchema), async (req, res) => {
    const user =  req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    user.id = await userModel.add(user);
    delete user.password;
    res.status(201).json(user);
});

module.exports = router;