// const { Sequelize, DataTypes } = require("sequelize");
// const db = require("../config/db");
// const Users = require("./users.model");
module.exports = (sequelize, Sequelize) => {
  const Transactions = sequelize.define(
    "transactions",
    {
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATEONLY,
      },
      type: {
        type: Sequelize.ENUM("Top Up", "Transfer"),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Transactions;
};

// Transactions.belongsTo(Users, { as: "senderUsers", foreignKey: "sender" });
// Transactions.belongsTo(Users, { as: "receiverUsers", foreignKey: "receiver" });
// module.exports = Transactions;
