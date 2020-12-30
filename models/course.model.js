const db = require('../utils/database');

module.exports = {
  findById: async (id) => {
    const list = await db('courses').where('id', id);
    if (list.length === 0) {
      return null;
    }
    return list[0];
  },

  highlightCourse: async (dates, limit) => {
    //SELECT DISTINCT(c.id) FROM `courses` as c LEFT JOIN `users_courses` as uc ON c.id = uc.courses_id WHERE uc.created_at BETWEEN '2020-12-14 00:00:00' AND '2020-12-19 00:00:00' LIMIT 10
    const highlights = await db('courses')
      .distinct('courses.id')
      .select('title', 'name', 'teacher', 'point_evaluate', 'img_large', 'price', 'sort_desc')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .whereBetween('users_courses.created_at', dates)
      .limit(limit)
    
    if (highlights.length === 0) {
      return null;
    }
    return highlights;
  },

  mostViewCourses: async (limit) => {
    //SELECT * FROM `courses` as c LEFT JOIN `videos` as v ON c.videos_id = v.id ORDER BY v.views DESC LIMIT 2
    const mostViews = await db('courses')
      .leftJoin('videos', 'courses.videos_id', 'videos.id')
      .orderBy('videos.views', 'desc')  
      .limit(limit)
    
    if (mostViews.length === 0) {
      return null;
    }
    return mostViews;
  },

  latestCourses: async (limit) => {
    const latest = await db('courses')
      .orderBy('created_at', 'desc')
      .limit(limit);
      
    if (latest.length === 0) {
      return null;
    }
    return latest;
  },

  subscribedCourses: async (limit, dates) => {
    const subscribed = await db('courses')
      .count('courses.categories_id', { as: 'countRegistered' })
      .select('categories.name')
      .leftJoin('users_courses', 'courses.id', 'users_courses.courses_id')
      .leftJoin('categories', 'courses.categories_id', 'categories.id')
      .whereBetween('users_courses.created_at', dates)
      .groupBy('courses.categories_id')
      .orderBy('countRegistered', 'desc')
      .limit(limit)

      if (subscribed.length === 0) {
        return null;
      }
      return subscribed;
  },

  search: async (q, limit, offset, rank) => {
    const courses = await db('courses')
      .select('courses.*', {category_name: 'categories.name'})
      .leftJoin('categories', 'categories.id', 'courses.categories_id')
      .whereRaw('MATCH(courses.search_name) AGAINST(?)', q)
      .orWhereRaw('MATCH(categories.search_name) AGAINST(?)', q)
      .orderBy('courses.id', rank)
      .limit(limit)
      .offset(offset)
    
    if (courses.length === 0) {
      return null;
    }
    return courses;
  },

  recommendCourses: async (id, recommendLimit) => {
    const recommendCourses = await db('courses')
      .whereRaw('categories_id = (SELECT categories_id FROM courses WHERE id = ?)', id)
      .andWhere('id', '<>', id)
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
  }
}