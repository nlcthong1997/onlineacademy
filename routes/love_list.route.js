const express = require('express');
const router = express.Router();

const loveListModel = require('../models/love_list.model');

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

module.exports = router;