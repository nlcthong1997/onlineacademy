const db = require('../utils/database');

module.exports = {
  feedbacksByCourseId: async (courseId) => {
    const feedbacks = await db('feedbacks')
      .select('users.username', 'feedbacks.*')
      .leftJoin('users', 'feedbacks.users_id', 'users.id')
      .where('courses_id', courseId);

    if (feedbacks.length === 0) {
      return null;
    }
    return feedbacks;
  }

}