// const { Sequelize, DataTypes } = require("sequelize");
// const db = require("../config/db");
module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "users",
    {
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      pin: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.NUMERIC,
      },
      descriptions: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Users;
};

// module.exports = Users;
