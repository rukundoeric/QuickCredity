/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import joi from 'joi';
import uuidv4 from 'uuid/v4';
import User from '../models/UserModel';
import Validator from '../utils/validation';
import ST from '../utils/status';
import MSG from '../utils/res_messages';
import auth from '../utils/auth';

class UserControler {
  async getAllUser(req, res) {
    User.getUserById(req.user.id).then((user) => {
      if (user.userRole === 'admin') {
        User.getAllUsers().then((users) => {
          res.status(200).send({
            status: 200,
            data: users,
          });
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'Access denied',
        });
      }
    });
  }

  async signUp(req, res, next) {
    joi.validate(req.body, Validator.Validate.userSchema).then(() => {
      User.getUserByEmail(req.body.email).then((user) => {
        if (user) {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: MSG.MSG_USER_ALREAD_EXIST,
          });
        } else {
          User.getUserByName(req.body.userName).then((user) => {
            if (user) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: MSG.MSG_USER_ALREAD_EXIST,
              });
            } else {
              const user = {
                id: uuidv4(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                address: req.body.address,
                userName: req.body.userName,
                createdOn: new Date(),
                status: 'unverified',
                userRole: req.body.userRole,
                password: req.body.password,
              };
              User.signup(user).then(() => {
                auth.generateToken(user).then((token) => {
                  res.status(ST.CREATED).send({
                    status: ST.CREATED,
                    data: {
                      token,
                      message: MSG.MSG_SIGNUP_SUCCESSFFUL,
                      user,
                    },
                  });
                });
              });
            }
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
    next();
  }

  async login(req, res) {
    joi.validate(req.body, Validator.Validate.loginSchema).then(() => {
      // eslint-disable-next-line consistent-return
      User.getUserByEmail(req.body.email).then((user) => {
        if (!user) {
          return res.status(ST.NOT_FOUND).send({
            status: ST.NOT_FOUND,
            error: MSG.MSG_NO_USER_EXIST,

          });
        }
        if (user.password === req.body.password) {
          auth.generateToken(user).then(token => res.status(ST.OK).send({
            status: ST.OK,
            data: {
              token,
              message: 'Loggedin successfully',
              user,
            },
          }));
        } else {
          return res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: MSG.MSG_WRONG_PASSWORD,
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async verfyUser(req, res, next) {
    joi.validate(req.body, Validator.Validate.verifySchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        if (user.userRole === 'admin' && user.status === 'verified') {
          User.getUserByEmail(req.params.email).then((user) => {
            if (!user) {
              return res.status(ST.NOT_FOUND).send({
                status: ST.NOT_FOUND,
                error: MSG.MSG_NO_USER_EXIST,

              });
            }
            User.getAllUsers().then((users) => {
              let i;
              for (i = 0; i < users.length; i++) {
                if (users[i].email === req.params.email) {
                  users[i].status = req.body.status;
                  res.status(ST.OK).send({
                    status: ST.OK,
                    Message: 'User is successfully verified',
                    data: user,

                  });
                }
              }
            });
          });
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            Message: MSG.MSG_ACCESS_DENIED,
            error: MSG.MSG_UNAUTHORIZED_ADMIN_ERROR,
            Suggestion: MSG.MSG_USER_SUGGESTION,
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
    next();
  }
}

export default new UserControler();
