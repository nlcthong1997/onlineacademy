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
    const result = await db('users').where({ id: userId, refresh_token: refreshToken });
    if (result.length > 0) {
      return true;
    }
    return false;
  },

  updatePassword: (userId, password) => {
    return db('users').where('id', userId).update('password', password);
  },

  update: (userId, data) => {
    return db('users').where('id', userId).update(data);
  }
}