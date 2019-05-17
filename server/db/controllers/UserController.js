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
}
