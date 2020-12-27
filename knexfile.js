require('dotenv').config();

module.exports = {

  development: {
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
    },
    seeds: {
      directory: './seeds/dev'
    }
  },

  staging: {
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
  },

  production: {
    client: process.env.DB_PRO,
    connection: {
      host : process.env.DB_HOST_PRO,
      user : process.env.DB_USER_PRO,
      password : process.env.DB_PASS_PRO,
      database : process.env.DB_DATABASE_PRO,
      port: process.env.DB_PORT_PRO
    },
    pool: { 
      min: 0, 
      max: 50 
    }
  }

};
