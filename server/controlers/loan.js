/* eslint-disable class-methods-use-this */
import joi from 'joi';
import uuidv4 from 'uuid/v4';
import dotenv from 'dotenv';
import Validator from '../utils/validation';
import ST from '../utils/status';
import MSG from '../utils/res_messages';
import Loan from '../models/LoanModel';
import User from '../models/UserModel';

const loanRepayment = 0;

class LoanControler {
  constructor() {
    dotenv.config();
  }

  async applyForLoan(req, res, next) {
    User.getUserById(req.user.id).then((user) => {
      if (user && user.userRole === 'client' && user.status === 'verified') {
        joi.validate(req.body, Validator.Validate.loanSchema).then(() => {
          Loan.getLoanByUserEmail(req.body.userEmail).then((loan) => {
            if (loan) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: MSG.MSG_LOAN_MUST_BE_ONE_AT_TIME,
              });
            } else {
              const { amount } = req.body;
              const { tenor } = req.body;
              const balance = amount - loanRepayment;
              const interest = (amount * 5) / 100;
              const paymentInstallment = (amount + interest) / tenor;
              const loan = {
                id: uuidv4(),
                userEmail: req.body.userEmail,
                createdOn: new Date(),
                status: 'Pending',
                repaid: false,
                tenor,
                amount,
                paymentInstallment,
                balance,
                interest,

              };
              Loan.applyforLoan(loan).then((applied) => {
                if (!applied) {
                  res.status(ST.BAD_REQUEST).send({
                    status: ST.BAD_REQUEST,
                    error: MSG.MSG_LOAN_NOT_APPLIED,
                  });
                }
                res.status(ST.OK).send({
                  status: ST.OK,
                  MEssage: MSG.MSG_LOAN_APPLIED_SUCCESSFULLY,
                  Data: loan,
                });
              });
            }
          });
        }).catch(error => res.send({
          status: 400,
          error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
        }));
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

  async getAllLoanApplications(req, res, next) {
    User.getUserById(req.user.id).then((user) => {
      if (user && user.userRole === 'admin' && user.status === 'verified') {
        Loan.viewLoan.then((loans) => {
          res.status(200).send({
            status: 200,
            data: loans,
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
}
export default new LoanControler();
