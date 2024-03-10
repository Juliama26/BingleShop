require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.TS_USERNAME,
    password: process.env.TS_PASSWORD,
    database: process.env.TS_DATABASE,
    host: process.env.TS_HOST,
    dialect: process.env.TS_DIALECT,
  },
  production: {
    username: process.env.PR_USERNAME,
    password: process.env.PR_PASSWORD,
    database: process.env.PR_DATABASE,
    host: process.env.PR_HOST,
    dialect: process.env.PR_DIALECT,
  },
};
