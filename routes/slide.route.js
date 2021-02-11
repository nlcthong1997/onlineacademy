const express = require('express');
const router = express.Router();
require('dotenv');

const d = require('../utils/date');
const cv = require('../utils/convert');
const types = require('../types/user_role');
const slideModel = require('../models/slide.model');

const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');
const createSlideSchema = require('../schemas/slide_c.json');

router.post('/', authorization([types.TEACHER]), validate(createSlideSchema), async (req, res) => {
  let slide = req.body;
  const id = await slideModel.add(slide);
  return res.status(201).json({
    id,
    message: 'Created.'
  })
});

// router.put('/:videoId', authorization([types.TEACHER]), validate(createVideoSchema), async (req, res) => {
//   let video = req.body;
//   let id = req.params.id;
//   await videoModel.update(video, id);
//   return res.status(200).json({
//     message: 'Updated.'
//   })
// })

module.exports = router;