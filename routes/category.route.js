const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category.model');

router.get('/', async (req, res) => {
  const categories = await categoryModel.findAll();
  return res.status(200).json(categories);
});

router.get('/:categoryId(\\d+)/courses', async (req, res) => {
  let id = req.params.categoryId;
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 0;

  const courses = await categoryModel.getCoursesByCategoryId(id, limit, offset);
  if (courses === null) {
    return res.status(204).json({
      message: 'Courses empty!'
    });
  }
  return res.status(200).json(courses);
});



module.exports = router;