const db = require("../models");
const { Sequelize } = require("sequelize");
const { success, failed } = require("../helpers/response");
// const usermodel = require("../models/users.model");
const Op = Sequelize.Op;
const usersModels = db.users;
const transactionsModels = db.transactions;

const transactions = {
  getAll: async (req, res) => {
    try {
      const id = req.userId;

      console.log(id);
      const result = await transactionsModels.findAll({
        where: {
          [Op.or]: [{ senderId: id }, { receiverId: id }],
        },
        include: [
          { model: usersModels, as: "senderUsers" },
          { model: usersModels, as: "receiverUsers" },
        ],
        order: [["id", "DESC"]],
      });
      success(res, result, "Get All Transactions Success");
    } catch (error) {
      failed(res.status(500), 500, error);
    }
  },
  getDetails: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await transactionsModels.findAll({
        where: {
          id,
        },
        include: [{ model: usersModels, as: "receiverUsers" }],
      });
      success(res, result, "Get All Transactions Success");
    } catch (error) {
      failed(res.status(500), 500, error);
    }
  },
  getIncome: async (req, res) => {
    try {
      const id = req.userId;

      const result = await transactionsModels.findAll({
        where: {
          receiverId: id,
        },
      });
      success(res, result, "Get All Data Success");
    } catch (error) {
      failed(res.status(404), 404, error);
    }
  },
  getExpense: async (req, res) => {
    try {
      const id = req.userId;
      const result = await transactionsModels.findAll({
        where: {
          senderId: id,
          type: "Transfer",
        },
      });
      success(res, result, "Get All Data Success");
    } catch (error) {
      failed(res.status(404), 404, error);
    }
  },
  topup: async (req, res) => {
    try {
      const { body } = req;
      const sender = req.userId;
      const getData = await usersModels.findAll({
        where: {
          id: sender,
        },
      });
      const resultUpdateSaldo = await usersModels.update(
        {
          balance: parseInt(getData[0].balance) + parseInt(body.amount),
        },
        {
          where: { id: sender },
        }
      );

      const result = await transactionsModels.create({
        senderId: sender,
        receiverId: body.receiver,
        amount: body.amount,
        balance: body.balance,
        notes: body.notes,
        type: "Top Up",
      });

      success(res, result, "Top Up Success");
    } catch (error) {
      failed(res.status(500), 500, error);
    }
  },
  transfer: async (req, res) => {
    try {
      const { body } = req;
      console.log(body);
      const sender = req.userId;

      // update saldo sender
      const resultUpdateSaldoSender = await usersModels.update(
        {
          balance: body.balance,
        },
        {
          where: { id: sender },
        }
      );

      // update data receiver
      const getDataReceiver = await usersModels.findAll({
        where: {
          id: body.receiver,
        },
      });
      const resultUpdateSaldoReceiver = await usersModels.update(
        {
          balance: parseInt(getDataReceiver[0].balance) + parseInt(body.amount),
        },
        {
          where: { id: body.receiver },
        }
      );
      // last code update data receiver

      const result = await transactionsModels.create({
        senderId: sender,
        receiverId: body.receiver,
        amount: body.amount,
        balance: body.balance,
        notes: body.notes,
        type: "Transfer",
      });

      success(res, result, "Transfer Success");
    } catch (error) {
      console.log(error);
      failed(res.status(500), 500, error);
    }
  },
};

module.exports = transactions;
