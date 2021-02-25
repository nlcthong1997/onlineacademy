const express = require('express');
const router = express.Router();
require('dotenv');

const d = require('../utils/date');
const cv = require('../utils/convert');
const types = require('../types/user_role');

const courseModel = require('../models/course.model');
const feedbackModel = require('../models/feedback.model');
const loveListModel = require('../models/love_list.model');
const userCourseModel = require('../models/user_course.model');
const videoModel = require('../models/video.model');
const slideModel = require('../models/slide.model');

const auth = require('../middlewares/auth.mdw');
const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');
const purchaseSchema = require('../schemas/purchase.json');
const feedbackSchema = require('../schemas/feedback.json');
const createCourseSchema = require('../schemas/course_c.json');
const updateCourseSchema = require('../schemas/course_u.json');

router.get('/', async (req, res) => {
  let limit = +req.query.limit || 5;
  let page = +req.query.page || 1;
  let offset = (page - 1) * limit;
  let { courses, total } = await courseModel.findAll(limit, offset);
  return res.status(200).json({
    courses,
    paginate: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      limit,
      qty: courses.length,
      currentPage: page,
      baseUrl: process.env.APP_BASE_URL,
      uri: '/courses?'
    }
  });
})

router.get('/:courseId(\\d+)', async (req, res) => {
  let id = req.params.courseId;
  let course = await courseModel.findById(id);
  const recommendLimit = 5;
  const recommend = await courseModel.recommendCourses(id, recommendLimit);
  const feedbacks = await feedbackModel.feedbacksByCourseId(id);

  if (course === null) {
    return res.status(400).json({
      message: 'Course is not exist'
    });
  }

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
  if (highlightsCourses === null) {
    return res.status(204).json({
      message: 'No content'
    });
  }
  return res.status(200).json(highlightsCourses);
});

router.get('/most-view', async (req, res) => {
  let limit = req.query.limit || 10;
  const mostViewCourses = await courseModel.mostViewCourses(limit);
  if (mostViewCourses === null) {
    return res.status(204).json({
      message: 'No content'
    });
  }
  return res.status(200).json(mostViewCourses);
});

router.get('/latest', async (req, res) => {
  let limit = req.query.limit || 10;
  const latestCourses = await courseModel.latestCourses(limit);
  if (latestCourses === null) {
    return res.status(204).json({
      message: 'No content'
    });
  }
  return res.status(200).json(latestCourses);
});

router.get('/most-subscribed', async (req, res) => {
  let limit = req.query.limit || 10;
  let dates = d.sevenEarlierDayToCurrent();
  const subscribedCourses = await courseModel.subscribedCourses(limit, dates);
  if (subscribedCourses === null) {
    return res.status(204).json({
      message: 'No content'
    });
  }
  return res.status(200).json(subscribedCourses);
});

router.get('/search', async (req, res) => {
  let q = req.query.q || '';
  q = cv.removeVietnameseTones(q);
  q = q.toLowerCase();

  let limit = +req.query.limit || 5;
  let page = +req.query.page || 1;
  let offset = (page - 1) * limit;
  let rank = req.query.rank || 'asc';
  let { courses, total } = await courseModel.search(q, limit, offset, rank);
  return res.status(200).json({
    courses,
    paginate: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      limit,
      qty: courses.length,
      currentPage: page,
      baseUrl: process.env.APP_BASE_URL,
      uri: `/courses/search?q=${q}`
    }
  })
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
      message: 'No content!'
    });
  }
  return res.status(200).json(registered);
});

router.post('/:courseId(\\d+)/buy', auth, async (req, res) => {
  let { userId } = req.accessTokenPayload;
  // let { amount } = req.body
  let courseId = req.params.courseId;
  let userCourse = {
    users_id: userId,
    courses_id: courseId,
  };

  //handle api pay

  let isValid = await userCourseModel.isValidBought(userCourse);
  if (!isValid) {
    return res.status(400).json({
      message: "Bạn đã mua khóa học này."
    });
  }

  const qtyRegistered = await courseModel.getQtyRegistered(courseId);
  await courseModel.update({ qty_student_registed: qtyRegistered + 1 }, courseId);

  const userCourseId = await userCourseModel.add(userCourse);
  
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

router.post('/', authorization([types.TEACHER]), validate(createCourseSchema), async (req, res) => {
  let course = req.body;
  let { userId } = req.accessTokenPayload;
  course.teacher_id = userId;
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

router.delete('/:courseId(\\d+)', authorization([types.TEACHER]), async (req, res) => {
  let id = req.params.courseId;
  let isValid = await courseModel.isValidDelete(id);
  if (isValid) {
    let course = await courseModel.findById(id, ['pending', 'completed']);
    let isDelCourse = await courseModel.delete({ id });
    if (isDelCourse) {
      let videos = await videoModel.findByCourseId(id);
      let slides = await slideModel.findByCourseId(id);
      await videoModel.delete({ courses_id: id });
      await slideModel.delete({ courses_id: id });
      return res.status(200).json({
        course: course || [],
        videos: videos || [],
        slides: slides || [],
        message: 'Deleted.'
      });
    }
  }
  return res.status(400).json({
    message: 'Deleted fail.'
  });
});

router.get('/:courseId(\\d+)/videos', auth, async (req, res) => {
  let { role, userId } = req.accessTokenPayload;
  let courseId = req.params.courseId;

  //isValid Registered Course
  let isValid = await userCourseModel.isValid({ users_id: userId, courses_id: courseId });
  if (role === types.USER && !isValid) {
    return res.status(400).json({
      message: 'You have not registered for this course.'
    });
  }

  let videos = await videoModel.findByCourseId(courseId);
  if (videos === null) {
    return res.status(204).json({
      message: 'No videos exist'
    });
  }
  return res.status(200).json(videos);
});

router.get('/:courseId(\\d+)/slides', auth, async (req, res) => {
  let { role, userId } = req.accessTokenPayload;
  let courseId = req.params.courseId;

  //isValid Registered Course
  let isValid = await userCourseModel.isValid({ users_id: userId, courses_id: courseId });
  if (role === types.USER && isValid) {
    return res.status(400).json({
      message: 'You have not registered for this course.'
    });
  }

  let slides = await slideModel.findByCourseId(courseId);
  if (slides === null) {
    return res.status(204).json({
      message: 'No slides exist'
    });
  }
  return res.status(200).json(slides);
});

router.get('/:courseId(\\d+)/video-intro', async (req, res) => {
  let courseId = req.params.courseId;
  let video = await videoModel.videoIntro(courseId);
  if (video === null) {
    return res.status(204).json({
      message: 'No video exist'
    });
  }
  return res.status(200).json(video);
});

router.get('/teacher-of-courses', authorization([types.TEACHER]), async (req, res) => {
  let { userId } = req.accessTokenPayload;
  let courses = await courseModel.findByTeacherId(userId);
  if (courses === null) {
    return res.status(204).json({
      message: 'No courses exist'
    });
  }
  return res.status(200).json(courses);
});

router.get('/:courseId/teacher-of-courses', authorization([types.TEACHER]), async (req, res) => {
  let courseId = req.params.courseId;
  let course = await courseModel.findById(courseId, ['completed', 'pending']);
  if (course === null) {
    return res.status(204).json({
      message: 'No courses exist'
    });
  }
  return res.status(200).json(course);
});

module.exports = router;