const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: "postgresql",

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const sequelizeHeroku = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: "postgres",
  production: {
    use_env_variable: process.env.DATABASE_URL,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

db.Sequelize = Sequelize;
// db.sequelize = sequelize || sequelizeHeroku;
db.sequelize = sequelizeHeroku;

db.users = require("../models/users.model")(sequelize, Sequelize);
db.transactions = require("../models/transactions.model")(sequelize, Sequelize);

db.users.hasMany(db.transactions, { as: "transactions" });
db.transactions.belongsTo(db.users, {
  foreignKey: "senderId",
  as: "senderUsers",
});
db.transactions.belongsTo(db.users, {
  foreignKey: "receiverId",
  as: "receiverUsers",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Success");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
