const express = require('express');
const router = express.Router();

const feedbackModel = require('../models/feedback.model');
const courseModel = require('../models/course.model')
const auth = require('../middlewares/auth.mdw');

router.get('/courses/:courseId(\\d+)/user', async (req, res) => {
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

router.get('/courses/:courseId(\\d+)', async (req, res) => {
  let courseId = req.params.courseId;
  const feedbacks = await feedbackModel.feedbacksByCourseId(courseId);
  if (feedbacks === null) {
    res.status(204).json({
      message: "Feedbacks is empty."
    });
  }
  return res.status(200).json(feedbacks);
});

router.post('/', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  const course = await courseModel.findById(req.body.courses_id);
  const newPoint = course.point_evaluate + req.body.point_evaluate;
  await courseModel.update({ point_evaluate: newPoint }, req.body.courses_id);
  const feedback = {
    comment: req.body.comment,
    courses_id: req.body.courses_id,
    users_id: userId
  };
  let id = await feedbackModel.add(feedback);
  return res.status(201).json({ id, message: 'Created.' });
})

module.exports = router;