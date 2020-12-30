const express = require('express');
const router = express.Router();

const feedbackModel = require('../models/feedback.model');

router.get('/courses/:courseId(\\d+)/', async (req, res) => {
  let courseId = req.params.courseId;
  let { userId } = req.accessTokenPayload;
  const feedbacks = await feedbackModel.findByUserCourse(userId, courseId);
  if (feedbacks === null) {
    res.status(204).json({
      message: "Feedbacks is empty."
    });
  }
  return res.status(200).json(feedbacks);
});

module.exports = router;