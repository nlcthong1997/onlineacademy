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
  let video = req.body;
  const rank = await videoModel.getMaxRank(video.courses_id);
  video.rank = rank + 1;
  const id = await videoModel.add(video);
  return res.status(201).json({
    id,
    rank: rank + 1,
    message: 'Created.'
  })
});

router.put('/:videoId', authorization([types.TEACHER]), validate(createVideoSchema), async (req, res) => {
  let video = req.body;
  let id = req.params.id;
  await videoModel.update(video, id);
  return res.status(200).json({
    message: 'Updated.'
  })
})

module.exports = router;