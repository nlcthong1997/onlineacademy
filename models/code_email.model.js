const db = require('../utils/database');

module.exports = {
  isValidateCode: async (code) => {
    const list = await db('code_mail').where({ code, active: true });
    if (list.length === 0) {
      return false;
    }
    return true;
  }
}