const express = require('express');
const router = express.Router();

const d = require('../utils/date');
const cv = require('../utils/convert');

const coursesModel = require('../models/course.model');
const feedbackModel = require('../models/feedback.model');
const loveListModel = require('../models/love_list.model');
const userCourseModel = require('../models/user_course.model');

const auth = require('../middlewares/auth.mdw');
const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');
const purchaseSchema = require('../schemas/purchase.json');
const feedbackSchema = require('../schemas/feedback.json');
const createCourseSchema = require('../schemas/c_course.json');
const updateCourseSchema = require('../schemas/u_course.json');

router.get('/:courseId(\\d+)', async (req, res) => {
  let id = req.params.courseId;
  let course = await coursesModel.findById(id);
  const recommendLimit = 5;
  const recommend = await coursesModel.recommendCourses(id, recommendLimit);
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
  const highlightsCourses = await coursesModel.highlightCourse(dates, limit);
  if (highlightsCourses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    });
  }
  return res.status(200).json(highlightsCourses);
});

router.get('/most-view', async (req, res) => {
  let limit = req.query.limit || 10;
  const mostViewCourses = await coursesModel.mostViewCourses(limit);
  if (mostViewCourses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    });
  }
  return res.status(200).json(mostViewCourses);
});

router.get('/latest', async (req, res) => {
  let limit = req.query.limit || 10;
  const latestCourses = await coursesModel.latestCourses(limit);
  if (latestCourses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    });
  }
  return res.status(200).json(latestCourses);
});

router.get('/most-subscribed', async (req, res) => {
  let limit = req.query.limit || 10;
  let dates = d.sevenEarlierDayToCurrent();
  const subscribedCourses = await coursesModel.subscribedCourses(limit, dates);
  if (subscribedCourses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    });
  }
  return res.status(200).json(subscribedCourses);
});

router.get('/search', async (req, res) => {
  let q = req.query.q || '';
  q = cv.removeVietnameseTones(q);
  q = q.toLowerCase();

  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;
  let rank = req.query.rank || 'asc';
  const result = await coursesModel.search(q, limit, offset, rank);
  if (result === null) {
    return res.status(204).json({
      message: 'No content!'
    });
  }
  return res.status(200).json(result)
});

router.post('/love-list', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let courseId = req.body.courseId || 0;
  if (courseId === 0) {
    return res.status(400).json({
      error: true,
      message: 'Missing data!'
    });
  }

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
  return res.status(200).json({
    id,
    message: 'Successfully.'
  });
});

router.delete('/love-list', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let courseId = req.body.courseId || 0;
  if (courseId === 0) {
    return res.status(400).json({
      error: true,
      message: 'Missing data!'
    });
  }

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
  const registered = await coursesModel.userRegistered(userId);
  if (registered === null) {
    return res.status(204).json({
      error: true,
      message: 'No content!'
    });
  }
  return res.status(200).json(registered);
});

router.post('/buy', auth, validate(purchaseSchema), async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let { courseId, amount } = req.body;
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

router.post('/feed-back', auth, validate(feedbackSchema), async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let { courseId, comment } = req.body;
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

router.post('/', authorization(['admin', 'teacher']), validate(createCourseSchema), async (req, res) => {
  const course = req.body;
  course.search_name = cv.removeVietnameseTones(course.search_name);
  let courseId = await coursesModel.add(course);
  return res.status(201).json({ id: courseId });
});

router.put('/', authorization(['admin', 'teacher']), validate(updateCourseSchema), async (req, res) => {

});

module.exports = router;