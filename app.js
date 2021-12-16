const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./src/models");
const usersRouter = require("./src/routers/users.route");
const transactionsRouter = require("./src/routers/transactions.route");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(usersRouter);
app.use(transactionsRouter);
db.sequelize.sync();
app.use(express.static(__dirname + "/uploads"));

const { PORT = 4004, LOCAL_ADDRESS = "0.0.0.0" } = process.env;
app.listen(PORT, LOCAL_ADDRESS, () => {
  console.log(`Service running on port ${PORT}`);
});

module.exports = app;
