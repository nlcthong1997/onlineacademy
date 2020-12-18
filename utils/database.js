require('dotenv').config();

const knex = require('knex')({
    client: process.env.DB,
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_DATABASE,
      port: process.env.DB_PORT
    },
    pool: { 
        min: 0, 
        max: 50 
    }
  });
  
module.exports = knex;