const express = require('express');
const router = express.Router();

const loveListModel = require('../models/love_list.model');
const auth = require('../middlewares/auth.mdw');

router.get('/', async (req, res) => {
  const { userId } = req.accessTokenPayload;
  const loveList = await loveListModel.findByUserId(userId);
  if (loveList === null) {
    return res.status(204).json({
      message: "The list is empty!"
    });
  }
  return res.status(200).json(loveList);
});

router.post('/', auth, async (req, res) => {
  const { userId } = req.accessTokenPayload;
  const data = { ...req.body, users_id: userId }
  const isExist = await loveListModel.isValid(data);
  if (isExist) {
    return res.status(400).json({
      message: 'This course has been add.'
    })
  }
  const id = await loveListModel.add(data);
  return res.status(201).json({ id });
});

router.delete('/', auth, async (req, res) => {
  const { userId } = req.accessTokenPayload;
  const data = { ...req.body, users_id: userId }
  const isExist = await loveListModel.isValid(data);
  if (!isExist) {
    return res.status(400).json({
      message: 'Can not remove.'
    })
  }
  await loveListModel.delete(data);
  return res.status(200).json({
    message: 'Removed.'
  });
});

module.exports = router;