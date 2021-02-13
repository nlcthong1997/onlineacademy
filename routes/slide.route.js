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
const updateSlideSchema = require('../schemas/slide_u.json');

router.post('/', authorization([types.TEACHER]), validate(createSlideSchema), async (req, res) => {
  let slide = req.body;
  const id = await slideModel.add(slide);
  return res.status(201).json({
    id,
    message: 'Created.'
  })
});

router.put('/:slideId', authorization([types.TEACHER]), validate(updateSlideSchema), async (req, res) => {
  let slide = req.body;
  let id = req.params.slideId;
  await slideModel.update(slide, id);
  return res.status(200).json({
    message: 'Updated.'
  })
})

module.exports = router;