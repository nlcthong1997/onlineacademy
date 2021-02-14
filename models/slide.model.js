const db = require('../utils/database');

module.exports = {
  findByCourseId: async (courseId) => {
    let slides = db('slides').where('courses_id', courseId).orderBy('id', 'asc');
    if (slides.length === 0) {
      return null;
    }
    return slides;
  },

  add: async (slide) => {
    const ids = await db('slides').insert(slide);
    return ids[0];
  },

  update: (slide, id) => {
    return db('slides').where('id', id).update(slide);
  },

  delete: (condition) => {
    return db('slides').where(condition).del();
  },
}