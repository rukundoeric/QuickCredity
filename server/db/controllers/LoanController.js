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

const paidAm = 0;
let balance = 0;
// For formating gate.
const today = new Date();
const date = today.getDate();
const month = today.getMonth(); // January is 0!
const year = today.getFullYear();
const formatedDate = `${date}/${month}/${year}`;

class LoanC {
  constructor() {
    dotenv.config();
  }


  async applyForLoan(req, res) {
    joi.validate(req.body, Validator.Validate.loanSchema).then(() => {
      QueryExecutor.queryParams(queryString.getClientUserByEmail, [req.body.userEmail]).then((result) => {
        if (result.rows[0]) {
          if (result.rows[0].status === 'verified') {
            QueryExecutor.queryParams(queryString.getLoanByUserEmailQuery, [req.body.userEmail]).then((loanResult) => {
              if (loanResult.rows[0]) {
                res.status(ST.BAD_REQUEST).send({
                  status: ST.BAD_REQUEST,
                  error: MSG.MSG_LOAN_MUST_BE_ONE_AT_TIME,
                });
              } else {
                const { amount } = req.body;
                const { tenor } = req.body;
                balance = amount - paidAm;
                const interest = (amount * 5) / 100;
                const paymentInstallment = (amount + interest) / tenor;
                const loan = {
                  id: uuidv4(),
                  userEmail: req.body.userEmail,
                  createdOn: formatedDate,
                  status: 'Pending',
                  repaid: false,
                  tenor,
                  amount,
                  paymentInstallment,
                  interest,
                };
                
                const loanArray = [uuidv4(), req.body.userEmail, formatedDate, 'pending', false, tenor, amount, paymentInstallment, interest];
                QueryExecutor.queryParams(queryString.apply, loanArray).then((result) => {
                  res.status(ST.OK).send({
                    status: ST.OK,
                    MEssage: MSG.MSG_LOAN_APPLIED_SUCCESSFULLY,
                    Data: loan,
                  });
                });
              }
            });
          } else {
            res.status(ST.BAD_REQUEST).send({
              status: ST.BAD_REQUEST,
              message: MSG.MSG_ACCESS_DENIED,
              error: MSG.MSG_NOT_CLIENT_VERIFIED,
            });
          }
        } else {
          res.status(ST.NOT_FOUND).send({
            status: ST.NOT_FOUND,
            message: MSG.MSG_ACCESS_DENIED,
            error: `No client found with email ${req.body.userEmail}`,
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }
}
export default new LoanC();
