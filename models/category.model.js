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

  getCoursesByCategoryId: async (id, limit, offset, status = ['completed']) => {
    const count = await db('categories')
      .leftJoin('courses', 'courses.categories_id', 'categories.id')
      .where('categories.id', id)
      .whereIn('courses.status', status)
      .count('courses.id', { as: 'total' });

    const courses = await db('categories')
      .leftJoin('courses', 'courses.categories_id', 'categories.id')
      .where('categories.id', id)
      .whereIn('courses.status', status)
      .limit(limit)
      .offset(offset);

    return {
      courses,
      total: count[0]['total']
    };
  },

  add: (category) => {
    return db('categories').insert(category);
  },

  update: (category, id) => {
    return db('categories').where('id', id).update(category);
  },

  delete: async (condition) => {
    return db('categories').where(condition).del();
  }

}