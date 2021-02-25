const db = require('../utils/database');

module.exports = {
  add: async (user) => {
    const ids = await db('users').insert(user);
    return ids[0];
  },

  findById: async (id) => {
    const users = await db('users').where('id', id);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  },

  find: async (condition) => {
    let raw = await db('users').where(condition);
    if (raw.length === 0) {
      return null;
    }
    if (raw.length === 1) {
      return raw[0];
    }
    return raw;
  },

  findByUserName: async (username) => {
    const users = await db('users').where('username', username);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  },

  updateRefreshToken: (userId, refreshToken) => {
    return db('users').where('id', userId).update('refresh_token', refreshToken);
  },

  isValidRefreshToken: async (userId, refreshToken) => {
    let result = await db('users').where({ id: userId, refresh_token: refreshToken });
    if (result.length > 0) {
      return true;
    }
    return false;
  },

  updatePassword: (userId, password) => {
    return db('users').where('id', userId).update('password', password);
  },

  update: (condition, data) => {
    return db('users').where(condition).update(data);
  },

  adminFind: async (condition) => {
    let raw = await db('users').select('id', 'username', 'phone', 'email', 'address', 'full_name', 'img_url', 'active').where(condition);
    if (raw.length === 0) {
      return null;
    }
    return raw;
  },

  isValidEmail: async (email) => {
    let emails = await db('users').where('email', email);
    if (emails.length > 0) {
      return true;
    }
    return false;
  },

  isValidUsername: async (username) => {
    let usernames = await db('users').where('username', username);
    if (usernames.length > 0) {
      return true;
    }
    return false;
  }
}