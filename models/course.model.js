const db = require('../utils/database');

module.exports = {
  findAll: async (limit, offset, status = ['completed']) => {
    let count = await db('courses').count('id', { as: 'total' }).whereIn('status', status);
    let courses = await db('courses').whereIn('status', status).orderBy('name', 'asc').limit(limit).offset(offset);
    return {
      courses,
      total: count[0]['total']
    };
  },

  findById: async (id, status = ['completed']) => {
    const list = await db('courses').where('id', id).whereIn('status', status);
    if (list.length === 0) {
      return null;
    }
    return list[0];
  },

  findByTeacherId: async (teacher_id) => {
    let courses = await db('courses').where('teacher_id', teacher_id);
    if (courses.length === 0) {
      return null;
    }
    return courses;
  },

  highlightCourse: async (dates, limit, status = ['completed']) => {
    const highlight = await db('courses')
      .distinct('courses.id')
      .select('title', 'name', 'teacher', 'point_evaluate', 'img_large', 'price', 'sort_desc')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .whereBetween('users_courses.created_at', dates)
      .whereIn('status', status)
      .limit(limit);

    if (highlight.length === 0) {
      return null;
    }
    return highlight;
  },

  mostViewCourses: async (limit) => {
    const mostView = await db('courses')
      .select('courses.*', 'videos.url', 'videos.views')
      .leftJoin('videos', 'courses.id', 'videos.courses_id')
      .orderBy('videos.views', 'desc')
      .limit(limit);

    if (mostView.length === 0) {
      return null;
    }
    return mostView;
  },

  latestCourses: async (limit, status = ['completed']) => {
    const latest = await db('courses')
      .whereIn('status', status)
      .orderBy('created_at', 'desc')
      .limit(limit);

    if (latest === 0) {
      return null;
    }
    return latest;
  },

  subscribedCourses: async (limit, dates, status = ['completed']) => {
    const subscribed = await db('courses')
      .count('courses.categories_id', { as: 'countRegistered' })
      .select('categories.name')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .leftJoin('categories', 'courses.categories_id', 'categories.id')
      .whereBetween('users_courses.created_at', dates)
      .whereIn('status', status)
      .groupBy('courses.categories_id')
      .orderBy('countRegistered', 'desc')
      .limit(limit);

    if (subscribed.length === 0) {
      return null;
    }
    return subscribed;
  },

  search: async (q, limit, offset, rank, status = ['completed']) => {
    let count = await db('courses')
      .select('courses.*', { category_name: 'categories.name' })
      .leftJoin('categories', 'categories.id', 'courses.categories_id')
      .whereIn('courses.status', status)
      .where(function () {
        this.whereRaw('MATCH(courses.search_name) AGAINST(?)', q)
          .orWhereRaw('MATCH(categories.search_name) AGAINST(?)', q)
      })
      .count('courses.id', { as: 'total' });

    let courses = await db('courses')
      .select('courses.*', { category_name: 'categories.name' })
      .leftJoin('categories', 'categories.id', 'courses.categories_id')
      .whereIn('courses.status', status)
      .where(function () {
        this.whereRaw('MATCH(courses.search_name) AGAINST(?)', q)
          .orWhereRaw('MATCH(categories.search_name) AGAINST(?)', q)
      })
      .orderBy('courses.id', rank)
      .limit(limit)
      .offset(offset)

    return {
      courses,
      total: count[0]['total']
    }
  },

  recommendCourses: async (id, recommendLimit, status = ['completed']) => {
    const recommendCourses = await db('courses')
      .whereRaw('categories_id = (SELECT categories_id FROM courses WHERE id = ?)', id)
      .andWhere('id', '<>', id)
      .whereIn('status', status)
      .limit(recommendLimit)

    if (recommendCourses.length === 0) {
      return null;
    }
    return recommendCourses;
  },

  userRegistered: async (userId) => {
    const registered = await db('courses')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .where('users_courses.users_id', userId)

    if (registered.length === 0) {
      return null;
    }
    return registered;
  },

  add: async (course) => {
    const ids = await db('courses').insert(course);
    return ids[0];
  },

  update: (course, courseId) => {
    return db('courses').where('id', courseId).update(course);
  },

  delete: (condition) => {
    return db('courses').where(condition).del();
  },

  isValidCategoriesCourses: async (categoryId) => {
    const categories = await db('courses').where('categories_id', categoryId);
    if (categories.length > 0) {
      return false;
    }
    return true;
  },

  isValidDelete: async (id) => {
    let course = await db('courses').where('id', id)
      .andWhere('qty_student_registed', null)
      .orWhere('qty_student_registed', 0)
    if (course.length > 0) {
      return true;
    }
    return false;
  }
}