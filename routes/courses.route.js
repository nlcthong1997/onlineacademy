const express = require('express');
const router = express.Router();

const d = require('../utils/date');
const coursesModel = require('../models/course.model');

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

module.exports = router;