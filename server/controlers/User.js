/* eslint-disable no-else-return */

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
      if (user.userRole === 'admin' && user.status === 'verified') {
        User.getAllUsers().then((users) => {
          res.status(200).send({
            ID: req.user.id,
            status: 200,
            data: {
              USers: users,
            },
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
          const user = {
            id: uuidv4(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            createdOn: new Date(),
            status: 'verified',
            userRole: req.body.userRole,
            password: req.body.password,
          };
          User.signup(user).then(() => {
            auth.generateToken(user).then((token) => {
              res.status(ST.CREATED).send({
                status: ST.CREATED,
                Token: token,
                Data: {
                  message: MSG.MSG_SIGNUP_SUCCESSFFUL,
                  User: user,
                },
              });
            });
          });
        }
      });
    }).catch(error => res.status(400).send({
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
            status: ST.CREATED,
            Token: token,
            message: 'Loggedin successfully',
            Data: {
              User: user,
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
              res.status(ST.NOT_FOUND).send({
                ID: req.user.id,
                status: ST.NOT_FOUND,
                error: MSG.MSG_NO_USER_EXIST,

              });
            } else {
              User.getAllUsers().then((users) => {
                let i;
                for (i = 0; i < users.length; i++) {
                  if (users[i].email === req.params.email) {
                    users[i].status = req.body.status;
                    res.status(ST.OK).send({
                      status: ST.OK,
                      Message: MSG.MSG_USER_VERIFIED,
                      data: user,

                    });
                  }
                }
              });
            }
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

  async resetPassword(req, res, next) {
    joi.validate(req.body, Validator.Validate.resetPassSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        const oldPass = req.body.oldPassword;
        const newPass = req.body.newPassword;
        const confirmPass = req.body.confirmPassword;
        if (newPass === confirmPass) {
          if (oldPass === user.password) {
            user.password = newPass;
            res.status(ST.OK).send({
              status: ST.OK,
              Data: {
                Message: 'Password reset successfully',
                User: user,
              },
            });
          } else {
            res.status(ST.BAD_REQUEST).send({
              status: ST.BAD_REQUEST,
              error: 'Password mismatch!',
            });
          }
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: 'Password mismatch!',
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }
}

export default new UserControler();
