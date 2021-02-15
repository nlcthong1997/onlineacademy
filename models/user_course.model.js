const db = require('../utils/database');

module.exports = {
  add: async (userCourse) => {
    const ids = await db('users_courses').insert(userCourse);
    return ids[0];
  },

  isValid: async (condition) => {
    const items = await db('users_courses').where(condition);
    if (items.length > 0) {
      return false;
    }
    return true;
  }
}