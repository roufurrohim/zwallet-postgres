const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
} = require("../helpers/env");

module.exports = {
  HOST: DB_HOST,
  USER: DB_USERNAME,
  PASSWORD: DB_PASSWORD,
  DB: DB_NAME,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
