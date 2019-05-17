/* eslint-disable no-useless-constructor */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import joi from 'joi';
import uuidv4 from 'uuid/v4';
import dotenv from 'dotenv';
import Validator from '../../utils/validation';
import ST from '../../utils/status';
import MSG from '../../utils/res_messages';
import Auth from '../middleware/auth';
import queryString from '../query';
import QueryExecutor from '../exec';

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
              res.status.send({
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
      QueryExecutor.queryParams(queryString.login, [req.body.email, req.body.password]).then((rows) => {
        if (rows[0]) {
          res.send({ Message: 'Logged in successfully' });
        } else {
          res.send({ Error: 'Incorrect email or password' });
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
      QueryExecutor.queryParams(queryString.checkIfUserIsVerified, [email]).then((verifyRes) => {
        if (verifyRes[0]) {
          res.status(ST.BAD_REQUEST).send({
            Status: ST.BAD_REQUEST,
            Message: `The user with email ${email} is already verified`,
            Data: verifyRes,
          });
        } else {
          QueryExecutor.queryParams(queryString.verifyUser, [req.body.status, email]).then((result) => {
            if (result[0]) {
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
    }).catch(error => res.status(400).send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }
}
export default new UserC();
