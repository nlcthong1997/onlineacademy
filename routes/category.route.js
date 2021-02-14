const express = require('express');
const router = express.Router();
require('dotenv');

const cv = require('../utils/convert');
const types = require('../types/user_role');

const authorization = require('../middlewares/authorization.mdw');
const validate = require('../middlewares/validate.mdw');

const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');

const createCategorySchema = require('../schemas/category_c.json');
const updateCategorySchema = require('../schemas/category_u.json');

router.get('/', async (req, res) => {
  const categories = await categoryModel.findAll();
  return res.status(200).json(categories);
});

router.get('/:categoryId(\\d+)', async (req, res) => {
  let id = req.params.categoryId;
  const category = await categoryModel.findById(id);
  return res.status(200).json(category);
});

router.get('/:categoryId(\\d+)/courses', async (req, res) => {
  let id = req.params.categoryId;
  let limit = +req.query.limit || 5;
  let page = +req.query.page || 1;
  let offset = (page - 1) * limit;
  let { courses, total } = await categoryModel.getCoursesByCategoryId(id, limit, offset);
  return res.status(200).json({
    courses,
    paginate: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      limit,
      qty: courses.length,
      currentPage: page,
      uri: `/categories/${id}/courses?`,
      baseUrl: process.env.APP_BASE_URL
    }
  });
});

router.post('/', authorization([types.ADMIN]), validate(createCategorySchema), async (req, res) => {
  let category = req.body;
  category.search_name = cv.removeVietnameseTones(category.name);
  let id = await categoryModel.add(category);
  return res.status(201).json({ id });
});

router.put('/:categoryId(\\d+)', authorization([types.ADMIN]), validate(updateCategorySchema), async (req, res) => {
  let category = req.body;
  let id = req.params.categoryId;
  if (category.hasOwnProperty('name')) {
    category.search_name = cv.removeVietnameseTones(category.name);
  }
  await categoryModel.update(category, id);
  return res.status(200).json({
    message: 'Update successfully.'
  });
});

router.delete('/:categoryId(\\d+)', authorization([types.ADMIN]), async (req, res) => {
  let id = req.params.categoryId;
  let isValid = await courseModel.isValidCategoriesCourses(id);
  if (isValid) {
    let bool = await categoryModel.delete(id);
    if (bool) {
      return res.status(200).status({
        message: 'Deleted.'
      });
    }
  }
  return res.status(410).json({
    error: true,
    message: 'Course does not delete.'
  });
});

module.exports = router;