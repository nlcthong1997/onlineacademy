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
  },

  getMaxRank: async (courseId) => {
    let res = await db('videos').max('rank', { as: 'rank' }).where('courses_id', courseId);
    if (res[0].rank === null) {
      return 0;
    }
    return res[0].rank;
  },

  add: async (video) => {
    const ids = await db('videos').insert(video);
    return ids[0];
  },

  update: (video, id) => {
    return db('videos').where('id', id).update(video);
  },

  delete: (condition) => {
    return db('videos').where(condition).del();
  },

  updateView: async (id) => {
    const res = await db('videos').select('views').where('id', id).first();
    await db('videos').where('id', id).update('views', res.views + 1);
  }
}