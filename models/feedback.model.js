const db = require('../utils/database');

module.exports = {
  feedbacksByCourseId: async (courseId) => {
    const feedbacks = await db('feedbacks')
      .select('users.username', 'feedbacks.*')
      .leftJoin('users', 'feedbacks.users_id', 'users.id')
      .where('courses_id', courseId)
      .orderBy('feedbacks.created_at', 'desc')

    if (feedbacks.length === 0) {
      return null;
    }
    return feedbacks;
  },

  add: async (userFeedback) => {
    const ids = await db('feedbacks').insert(userFeedback);
    return ids[0];
  },

  findByUserCourse: async (userId, courseId) => {
    const list = await db('feedbacks')
      .where({ users_id: userId, courses_id: courseId })
      .orderBy('created_at', 'desc');
    if (list.length === 0) {
      return null;
    }
    return list;
  }

}