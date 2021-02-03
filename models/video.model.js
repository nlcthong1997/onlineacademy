const db = require('../utils/database');

module.exports = {
  findByCourseId: async (courseId) => {
    let videos = db('videos').where('courses_id', courseId).orderBy('id', 'asc');
    if (videos.length === 0) {
      return null;
    }
    return videos;
  },

  videoIntro: async (courseId) => {
    let video = await db('videos').where('courses_id', courseId).first();
    if (!video) {
      return null;
    }
    return video;
  }
}