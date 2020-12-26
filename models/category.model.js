const { limit } = require('../utils/database');
const db = require('../utils/database');

module.exports = {
  findAll: () => {
    return db('categories');
  },

  getCoursesByCategoryId: async (id, limit, offset) => {
    const courses = await db('categories')
      .leftJoin('courses', 'courses.categories_id', 'categories.id')
      .where('categories.id', id)
      .limit(limit)
      .offset(offset)
      
    if (courses.length === 0) {
      return null;
    }
    return courses;
  }


}