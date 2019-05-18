/* eslint-disable no-useless-constructor */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import joi from 'joi';
import uuidv4 from 'uuid/v4';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Validator from '../../utils/validation';
import ST from '../../utils/status';
import MSG from '../../utils/res_messages';
import Auth from '../middleware/auth';
import queryString from '../query';
import QueryExecutor from '../exec';
import CreateTables from '../create/db';

class UserC {
  constructor() {
    dotenv.config();
  }

  async signUp(req, res) {
    joi.validate(req.body, Validator.Validate.userSchema).then(() => {
      QueryExecutor.queryParams(queryString.getUserByEmail, [req.body.email]).then((rows) => {
        if (rows[0]) {
          res.json({
            status: ST.BAD_REQUEST,
            error: MSG.MSG_USER_ALREAD_EXIST,
          });
        } else {
          let isAdmin = false;
          if (req.body.userRole === 'admin') {
            isAdmin = true;
          }
          const userId = uuidv4();
          // For formating gate.
          const today = new Date();
          const date = today.getDate();
          const month = today.getMonth(); // January is 0!
          const year = today.getFullYear();
          const formatedDate = `${date}/${month}/${year}`;

          const userdata = [userId, req.body.firstName, req.body.lastName, req.body.email, req.body.address, formatedDate, 'unverified', isAdmin, req.body.password];
          const user = {
            id: userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            Date: formatedDate,
            status: 'unverified',
            isUserAdmin: isAdmin,
            password: req.body.password,

          };
          QueryExecutor.queryParams(queryString.signup, userdata).then(() => {
            Auth.generateToken(user).then((token) => {
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
  }

  async login(req, res) {
    joi.validate(req.body, Validator.Validate.loginSchema).then(() => {
      QueryExecutor.queryParams(queryString.login, [req.body.email]).then((result) => {
        if (result.rows[0]) {
          if (result.rows[0].password === req.body.password) {
            auth.generateToken(result.rows[0]).then((token) => {
              res.status(ST.OK).send(
                {
                  status: ST.OK,
                  data: {
                    message: 'Logged in successfully',
                    token,
                    user: result.rows[0],
                  },
                },
              );
            });
          } else {
            res.status(ST.BAD_REQUEST).send(
              {
                status: ST.BAD_REQUEST,
                error: { message: 'Wrong passsword ' },
              },
            );
          }
        } else {
          res.status(ST.NOT_FOUND).send(
            {
              status: ST.NOT_FOUND,
              error: { message: 'User doen\'t exist! ' },
            },
          );
        }
      });
    }).catch(error => res.status(400).send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async verify(req, res) {
    const { email } = req.params;
    joi.validate(req.body, Validator.Validate.verifySchema).then(() => {
      QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
        if (userResult.rows[0].isadmin === true && userResult.rows[0]) {
          QueryExecutor.queryParams(queryString.checkIfUserIsVerified, [email]).then((verifyRes) => {
            if (verifyRes.rows[0]) {
              res.status(ST.BAD_REQUEST).send({
                Status: ST.BAD_REQUEST,
                Message: `The user with email ${email} is already verified`,
                data: verifyRes.rows[0],
              });
            } else {
              QueryExecutor.queryParams(queryString.verifyUser, [req.body.status, email]).then((result) => {
                if (result) {
                  res.send({
                    Status: 200,
                    Message: `The user with email ${email} is now verified successfully !`,
                  });
                } else {
                  res.status(ST.BAD_REQUEST).send({
                    Status: ST.BAD_REQUEST,
                    Message: `User with email ${email} is not verified, may be this email is doesn't exist!`,
                  });
                }
              });
            }
          });
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: 'Maybe you are not admin or not verified',
          });
        }
      });
    }).catch(error => res.status(400).send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async resetPassword(req, res) {
    const { email } = req.params;
    const defaultPasword = `Quick_${new Date().getMilliseconds()}`;
    const output = `Your new password is ${defaultPasword}`;
    if (Object.keys(req.body).length === 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: process.env.QUICK_CREDIT_EMAIL,
          pass: process.env.QUICK_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });
      const mailOptions = {
        from: 'Quick credit',
        to: email,
        subject: 'Quick credit password reset',
        text: output,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
      QueryExecutor.queryParams(queryString.resetPassword, [defaultPasword, email]).then((resetResult) => {
        if (resetResult) {
          res.status(204).send(
            {
              status: 204,
            },
          );
        } else {
          res.status(ST.BAD_REQUEST).send({
            Status: ST.BAD_REQUEST,
            Message: 'Unknown error',
          });
        }
      });
    } else {
      const { oldPassword } = req.body;
      QueryExecutor.queryParams(queryString.getUserByEmail, [email]).then((userResult) => {
        if (!userResult.rows[0]) {
          res.status(ST.NOT_FOUND).send({
            Status: ST.NOT_FOUND,
            Message: 'User doesn\'t exist!',
          });
        } else {
          const { newPassword } = req.body;
          const { confirmPassword } = req.body;
          if (userResult.rows[0].password === oldPassword && newPassword === confirmPassword) {
            QueryExecutor.queryParams(queryString.resetPassword, [newPassword, email]).then((resetResult) => {
              if (resetResult) {
                res.status(ST.OK).send({
                  Status: ST.OK,
                  Message: 'You\'ve successfully reset your password!',
                });
              } else {
                res.status(ST.BAD_REQUEST).send({
                  Status: ST.BAD_REQUEST,
                  Message: 'Unknown error',
                });
              }
            });
          } else {
            res.status(ST.BAD_REQUEST).send({
              Status: ST.BAD_REQUEST,
              Message: 'Password mismatch!',
            });
          }
        }
      });
    }
  }

  async getUsers(req, res) {
    QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((result) => {
      if (result.rows[0].isadmin === true && result.rows[0].status === 'verified') {
        QueryExecutor.queryParams(queryString.getAllUser, []).then((userResult) => {
          res.status(ST.OK).send({
            status: ST.OK,
            data: {
              Found: `${userResult.rows.length} User(s)`,
              Users: userResult.rows,
            },
          });
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'Maybe you are not admin or not verified',
        });
      }
    });
  }
}
export default new UserC();
