const db = require('../utils/database');

module.exports = {
  findById: async (id) => {
    const list = await db('categories').where('id', id);
    if (list.length === 0) {
      return null;
    }
    return list[0];
  },

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
  },

  add: (category) => {
    return db('categories').insert(category);
  },

  update: (category, id) => {
    return db('categories').where('id', id).update(category);
  }


}