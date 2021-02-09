const express = require('express');
const router = express.Router();
require('dotenv');

const d = require('../utils/date');
const cv = require('../utils/convert');
const types = require('../types/user_role');
const videoModel = require('../models/video.model');

const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');
const createVideoSchema = require('../schemas/video_c.json');

router.post('/', authorization([types.TEACHER]), validate(createVideoSchema), async (req, res) => {
  const rank = await videoModel.getMaxRank(req.body.courses_id);
  req.body.rank = rank + 1;
  const id = await videoModel.add(req.body);
  return res.status(201).json({
    id,
    rank: rank + 1,
    message: 'Created.'
  })
});

module.exports = router;