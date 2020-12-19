const db = require('../utils/database');

module.exports = {
  findAll: () => {
    return db('categories');
  }


}