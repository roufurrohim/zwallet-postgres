const express = require("express");
const authen = require("../middleware/authentic");
const upload = require("../middleware/uploads");

const {
  getAll,
  getDetail,
  register,
  setupPin,
  login,
  update,
  pin,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/users", authen, getAll);
usersRouter.get("/user/:id", authen, getDetail);
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/pin", authen, pin);
usersRouter.put("/setpin", authen, setupPin);
usersRouter.put("/update", authen, upload, update);

module.exports = usersRouter;
