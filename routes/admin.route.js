const express = require('express');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const router = express.Router();
require('dotenv').config();

const validate = require('../middlewares/validate.mdw');
const studentUpdateSchema = require('../schemas/student_u.json')
const teacherUpdateSchema = require('../schemas/teacher_u.json')
const adminUpdateCourseSchema = require('../schemas/admin_course_u.json');
const createTeacher = require('../schemas/create_teacher.json');
const userModel = require('../models/user.model');
const courseModel = require('../models/course.model');
const types = require('../types/user_role');

router.get('/students', async (req, res) => {
  const students = await userModel.adminFind({ role: 'user' });
  if (students === null) {
    return res.status(204).json({
      message: 'Students empty.'
    });
  }
  return res.status(200).json(students);
});

router.put('/students/:stdId', validate(studentUpdateSchema), async (req, res) => {
  const stdId = req.params.stdId;
  await userModel.update({ id: stdId }, req.body);
  return res.status(200).json({
    message: 'Update successfully'
  });
});

router.get('/teachers', async (req, res) => {
  const teachers = await userModel.adminFind({ role: 'teacher' });
  if (teachers === null) {
    return res.status(204).json({
      message: 'Teachers empty.'
    });
  }
  return res.status(200).json(teachers);
})

router.put('/teachers/:teacherId', validate(teacherUpdateSchema), async (req, res) => {
  const teacherId = req.params.teacherId;
  await userModel.update({ id: teacherId }, req.body);
  return res.status(200).json({
    message: 'Update successfully'
  });
});

router.get('/courses', async (req, res) => {
  let courses = await courseModel.adminFindAll();
  if (courses === null) {
    return res.status(204).json({
      message: 'No courses exist'
    })
  }
  return res.status(200).json(courses);
})

router.put('/courses/:courseId', validate(adminUpdateCourseSchema), async (req, res) => {
  let courseId = req.params.courseId;
  await courseModel.update(req.body, courseId);
  return res.status(200).json({
    message: 'Updated.'
  });
});

router.post('/teachers', validate(createTeacher), async (req, res) => {
  const isValidUsername = await userModel.isValidUsername(req.body.username);
  const isValidEmail = await userModel.isValidEmail(req.body.email);
  if (isValidUsername) {
    return res.status(400).json({
      message: 'Tài khoản đã tồn tại'
    })
  }

  if (isValidEmail) {
    return res.status(400).json({
      message: 'Email đã tồn tại'
    })
  }

  let data = req.body;
  data.password = bcrypt.hashSync(data.password, 10);
  data.role = types.TEACHER;
  data.active = true;

  await userModel.add(data);
  return res.status(201).json({
    message: 'Tạo tài khoản thành công'
  })
});

module.exports = router;