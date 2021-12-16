const db = require("../models");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { success, failed } = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/env");
const Op = Sequelize.Op;
// const usersModels = require("../models/users.model");
const usersModels = db.users;

const users = {
  getAll: async (req, res) => {
    try {
      const { query } = req;
      const idLogin = req.userId;
      const search = query.search === undefined ? "" : query.search;
      const field = query.field === undefined ? "id" : query.field;
      const typeSort = query.sort === undefined ? "ASC" : query.sort;
      const limit = query.limit === undefined ? 5 : parseInt(query.limit);
      const page = query.page === undefined ? 1 : query.page;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      const all = await usersModels.findAll({
        where: {
          first_name: {
            [Op.like]: `%${search}%`,
          },
        },
      });

      const result = await usersModels.findAll({
        where: {
          first_name: {
            [Op.like]: `%${search}%`,
          },
        },
        offset,
        field,
        typeSort,
      });

      const dataOutput = result.filter((e) => e.id !== idLogin);
      const response = {
        dataOutput,
        totalPage: Math.ceil(all.length / limit),
        // limit,
        page,
      };
      success(res, response, "Get All Users Success");
    } catch (error) {
      failed(res, 404, error);
    }
  },

  getDetail: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await usersModels.findAll({
        where: {
          id,
        },
      });
      success(res, result, "Get Details Users Success");
    } catch (error) {
      failed(res, 404, error);
    }
  },

  login: async (req, res) => {
    try {
      const { body } = req;
      const email = req.body.email;
      const cekEmail = await usersModels.findAll({
        where: {
          email,
        },
      });
      if (cekEmail.length <= 0) {
        failed(res.status(404), 404, "Email not Exist");
      } else {
        const passwordHash = cekEmail[0].password;
        bcrypt.compare(body.password, passwordHash, (error, checkpassword) => {
          if (error) {
            res.json(error);
          } else if (checkpassword === true) {
            const user = cekEmail[0];
            const payload = {
              id: user.id,
            };
            const output = {
              user,
              token: jwt.sign(payload, JWT_SECRET),
            };
            success(res, output, "Login Success");
          } else {
            failed(res.status(404), 404, "Wrong Password");
          }
        });
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },

  register: async (req, res) => {
    try {
      const { body } = req;
      const hash = bcrypt.hashSync(body.password, 10);
      const email = req.body.email;
      const phone = req.body.phone;
      const cekEmail = await usersModels.findAll({
        where: {
          email,
        },
      });

      const cekPhone = await usersModels.findAll({
        where: {
          phone,
        },
      });
      if (cekEmail.length <= 0) {
        if (cekPhone.length <= 0) {
          const payloadRes = {
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hash,
            phone: body.phone,
            image: "default.jpg",
            balance: 0,
          };
          const result = await usersModels.create(payloadRes);
          console.log(result.id);
          // jwt
          const payload = {
            id: result.id,
          };

          const output = {
            result,
            token: jwt.sign(payload, JWT_SECRET),
          };
          success(res, output, 200, "Register Success");
        } else {
          failed(res.status(401), 401, "Number Phone already exist");
        }
      } else {
        failed(res.status(401), 401, "Email already exist");
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },
  setupPin: async (req, res) => {
    try {
      const pin = req.body.pin;
      console.log(pin);
      const id = req.userId;
      const hash = bcrypt.hashSync(pin, 10);
      const result = await usersModels.update(
        {
          pin: hash,
        },
        {
          where: {
            id,
          },
        }
      );
      success(res, result, "Setup Pin success");
    } catch (error) {
      failed(res, 500, error);
    }
  },
  pin: async (req, res) => {
    try {
      const id = req.userId;
      const { body } = req;

      const cekPin = await usersModels.findAll({
        where: {
          id,
        },
      });
      if (cekPin.length <= 0) {
        failed(res.status(404), 404, "Email not Exist");
      } else {
        const pinHash = cekPin[0].pin;
        bcrypt.compare(body.pin, pinHash, (error, checkpassword) => {
          if (error) {
            res.status(500).json(error);
          } else if (checkpassword === true) {
            const user = cekPin[0];
            const output = {
              user,
            };
            success(res, output, "Success");
          } else {
            failed(res.status(404), 404, "Wrong Pin");
          }
        });
      }
    } catch (error) {
      failed(res.status(500), 500, error);
    }
  },

  update: async (req, res) => {
    try {
      const { first_name, last_name, email, phone, descriptions } = req.body;

      const id = req.userId;
      const Detail = await usersModels.findAll({
        where: {
          id,
        },
      });
      const result = await usersModels.update(
        {
          first_name,
          last_name,
          email,
          phone,
          image: req.file ? req.file.filename : "default.png",
          descriptions,
        },
        {
          where: {
            id,
          },
        }
      );

      if (Detail[0].image === "default.jpg") {
        success(res, result, "Update Data Success");
      } else {
        fs.unlink(`./uploads/${Detail[0].image}`, (err) => {
          if (err) {
            failed(res.status(500), 500, err);
          } else {
            success(res, result, "Update Data Success");
          }
        });
      }
    } catch (error) {
      failed(res, 500, error);
    }
  },

  updateBalance: async (req, res) => {
    try {
      const id = req.userId;
      const nominalTf = req.nominal;

      const getData = await usersModels.findAll({
        where: {
          id,
        },
      });

      const saldo = getData[0].balance;

      const result = await usersModels.update({
        balance: saldo + nominalTf,
      });
      success(res, result, "insert data success");
    } catch (error) {
      failed(res.status(500), 500, error);
    }
  },
};

module.exports = users;
