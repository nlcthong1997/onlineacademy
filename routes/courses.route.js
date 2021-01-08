const express = require('express');
const router = express.Router();

const d = require('../utils/date');
const cv = require('../utils/convert');
const types = require('../types/user_role');

const courseModel = require('../models/course.model');
const feedbackModel = require('../models/feedback.model');
const loveListModel = require('../models/love_list.model');
const userCourseModel = require('../models/user_course.model');

const auth = require('../middlewares/auth.mdw');
const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');
const purchaseSchema = require('../schemas/purchase.json');
const feedbackSchema = require('../schemas/feedback.json');
const createCourseSchema = require('../schemas/course_c.json');
const updateCourseSchema = require('../schemas/course_u.json');

router.get('/', async (req, res) => {
  let courses = await courseModel.findAll();
  return res.status(200).json(courses);
})

router.get('/:courseId(\\d+)', async (req, res) => {
  let id = req.params.courseId;
  let course = await courseModel.findById(id);
  const recommendLimit = 5;
  const recommend = await courseModel.recommendCourses(id, recommendLimit);
  const feedbacks = await feedbackModel.feedbacksByCourseId(id);

  return res.status(200).json({
    course: course || [],
    recommend: recommend || [],
    feedbacks: feedbacks || []
  });
});

router.get('/highlights-last-week', async (req, res) => {
  let limit = req.query.limit || 4;
  let dates = d.sevenEarlierDayToCurrent();
  const highlightsCourses = await courseModel.highlightCourse(dates, limit);
  return res.status(200).json(highlightsCourses);
});

router.get('/most-view', async (req, res) => {
  let limit = req.query.limit || 10;
  const mostViewCourses = await courseModel.mostViewCourses(limit);
  return res.status(200).json(mostViewCourses);
});

router.get('/latest', async (req, res) => {
  let limit = req.query.limit || 10;
  const latestCourses = await courseModel.latestCourses(limit);
  return res.status(200).json(latestCourses);
});

router.get('/most-subscribed', async (req, res) => {
  let limit = req.query.limit || 10;
  let dates = d.sevenEarlierDayToCurrent();
  const subscribedCourses = await courseModel.subscribedCourses(limit, dates);
  return res.status(200).json(subscribedCourses);
});

router.get('/search', async (req, res) => {
  let q = req.query.q || '';
  q = cv.removeVietnameseTones(q);
  q = q.toLowerCase();

  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  let rank = req.query.rank || 'asc';
  const result = await courseModel.search(q, limit, offset, rank);
  if (result === null) {
    return res.status(204).json({
      message: 'No content!'
    });
  }
  return res.status(200).json(result)
});

router.post('/:courseId(\\d+)/love-list', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let courseId = req.params.courseId;

  let data = {
    users_id: userId,
    courses_id: courseId
  }

  let isValid = await loveListModel.isValid(data);
  if (isValid) {
    return res.status(409).json({
      error: true,
      message: 'The course exists in the list!'
    });
  }

  let id = await loveListModel.add(data);
  return res.status(200).json({ id });
});

router.delete('/:courseId(\\d+)/love-list', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let courseId = req.params.courseId;

  let bool = await loveListModel.delete({
    users_id: userId,
    courses_id: courseId
  });

  if (bool) {
    res.status(200).json({
      message: 'Deleted.'
    });
  } else {
    res.status(200).json({
      message: 'Delete failed'
    });
  }

  return res;
});

router.get('/registered', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  const registered = await courseModel.userRegistered(userId);
  if (registered === null) {
    return res.status(204).json({
      error: true,
      message: 'No content!'
    });
  }
  return res.status(200).json(registered);
});

router.post('/:courseId(\\d+)/buy', auth, validate(purchaseSchema), async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let { amount } = req.body;
  let courseId = req.params.courseId;
  let userCourse = {
    users_id: userId,
    courses_id: courseId,
  };

  //handle api pay

  let isValid = await userCourseModel.isValid(userCourse);
  if (isValid) {
    return res.status(409).json({
      error: true,
      message: "This course has been registered"
    });
  }

  const userCourseId = await userCourseModel.add({ ...userCourse, amount });
  return res.status(200).json({ userCourseId });
});

router.post('/:courseId(\\d+)/feed-back', auth, validate(feedbackSchema), async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let { comment } = req.body;
  let courseId = req.params.courseId;
  let userFeedback = {
    courses_id: courseId,
    users_id: userId
  };
  let isValidUserRegistered = await userCourseModel.isValid(userFeedback);
  if (isValidUserRegistered) {
    return res.status(409).json({
      error: true,
      message: 'You cannot respond to this course'
    });
  }
  const userFeedbackId = await feedbackModel.add({ ...userFeedback, comment });
  return res.status(200).json({ userFeedbackId });
});

router.post('/', authorization([types.ADMIN, types.TEACHER]), validate(createCourseSchema), async (req, res) => {
  let course = req.body;
  course.search_name = cv.removeVietnameseTones(course.name);
  let courseId = await courseModel.add(course);
  return res.status(201).json({ id: courseId });
});

router.put('/:courseId(\\d+)', authorization([types.ADMIN, types.TEACHER]), validate(updateCourseSchema), async (req, res) => {
  let course = req.body;
  if (course.hasOwnProperty('name')) {
    course.search_name = cv.removeVietnameseTones(course.name);
  }
  await courseModel.update(course, req.params.courseId);
  return res.status(200).json({
    message: 'Update successfully.'
  });
});

router.delete('/:courseId(\\d+)', authorization([types.ADMIN]), async (req, res) => {
  let id = req.params.courseId;
  let bool = courseModel.delete({id});
  if (bool) {
    return res.status(200).status({
      message: 'Deleted.'
    });
  } else {
    return res.status(400).status({
      message: 'Deleted fail.'
    });
  }
});

module.exports = router;