const express = require("express");
const authen = require("../middleware/authentic");

const {
  getAll,
  topup,
  transfer,
  getIncome,
  getExpense,
  getDetails,
} = require("../controllers/transactions.controller");

const transactionsRouter = express.Router();

transactionsRouter.get("/all-transactions", authen, getAll);
transactionsRouter.get("/details-transactions/:id", authen, getDetails);
transactionsRouter.get("/all-income", authen, getIncome);
transactionsRouter.get("/all-expense", authen, getExpense);
transactionsRouter.post("/topup", authen, topup);
transactionsRouter.post("/transfer", authen, transfer);

module.exports = transactionsRouter;
