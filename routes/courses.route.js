const express = require('express');
const router = express.Router();

const d = require('../utils/date');
const coursesModel = require('../models/course.model');

router.get('/highlights-last-week', async (req, res) => {
  const limit = req.query.limit || 4;
  const dates = d.sevenEarlierDayToCurrent();
  const courses = await coursesModel.highlightCourse(dates, limit);
  if (courses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    })
  }
  return res.status(200).json(courses);
});

module.exports = router;