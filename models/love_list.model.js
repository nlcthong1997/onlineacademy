const db = require('../utils/database');

module.exports = {
  findByUserId: async (userId) => {
    const list = await db('love_list')
      .leftJoin('courses', 'love_list.courses_id', 'courses.id')
      .where('users_id', userId);
    if (list.length === 0) {
      return null;
    }
    return list;
  },

  add: async (data) => {
    const ids = await db('love_list').insert(data);
    return ids[0];
  },

  delete: (condition) => {
    return db('love_list').where(condition).del();

  },

  isValid: async (condition) => {

    const items = await db('love_list').where(condition);
    console.log();
    if (items.length > 0) {
      return true;
    }
    return false;
  }
}