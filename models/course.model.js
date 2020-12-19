const { limit } = require('../utils/database');
const db = require('../utils/database');

module.exports = {
  highlightCourse: async (dates, limit) => {
    //SELECT DISTINCT(c.id) FROM `courses` as c LEFT JOIN `users_courses` as uc ON c.id = uc.courses_id WHERE uc.created_at BETWEEN '2020-12-14 00:00:00' AND '2020-12-19 00:00:00' LIMIT 10
    const courses = await db('courses')
      .distinct('courses.id')
      .select('title', 'name', 'teacher', 'point_evaluate', 'img_large', 'price', 'sort_desc')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .whereBetween('users_courses.created_at', dates)
      .limit(limit)
    
    if (courses.length === 0) {
      return null;
    }
    return courses;
  }
}