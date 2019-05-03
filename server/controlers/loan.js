/* eslint-disable no-cond-assign */
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
    joi.validate(req.body, Validator.Validate.loanSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        if (user && user.userRole === 'client' && user.status === 'verified') {
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
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            Message: MSG.MSG_ACCESS_DENIED,
            error: MSG.MSG_NOT_CLIENT,
            UserRole: user.userRole,
            Suggestion: MSG.MSG_USER_SUGGESTION,
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async getAllLoanApplications(req, res, next) {
    User.getUserById(req.user.id).then((user) => {
      if (user && user.userRole === 'admin' && user.status === 'verified') {
        Loan.viewLoan().then((loans) => {
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

  async getSpecLoan(req, res, next) {
    User.getUserById(req.user.id).then((user) => {
      if (user && user.userRole === 'admin' && user.status === 'verified') {
        Loan.getSpecLoan(req.params.id).then((loan) => {
          if (!loan) {
            res.status(ST.BAD_REQUEST).send({
              status: ST.BAD_REQUEST,
              error: 'No loan found with this id',
            });
          } else {
            res.status(200).send({
              Status: 200,
              Message: 'Loan found',
              Data: loan,
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
  }

  async viewRepaidLoans(req, res, next) {
    joi.validate(req.body, Validator.Validate.repaidLoanSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        let repaidLoans = [];
        if (user && user.userRole === 'admin' && user.status === 'verified') {
          Loan.viewLoan().then((loans) => {
            if (!loans) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: 'No loan found',
              });
            } else {
              for (let i = 0; i < loans.length; i++) {
                if (loans[i].status === req.body.status && loans[i].repaid === req.body.repaid) {
                  repaidLoans = loans[i];
                }
              }
              if (repaidLoans.length < 1) {
                res.status(ST.BAD_REQUEST).send({
                  status: ST.BAD_REQUEST,
                  error: 'No loan found',
                });
              } else {
                res.status(200).send({
                  Status: 200,
                  Message: 'Loans found',
                  Data: repaidLoans,
                });
              }
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

  async viewCurrentLoans(req, res, next) {
    joi.validate(req.body, Validator.Validate.repaidLoanSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        let currentLoans = [];
        if (user && user.userRole === 'admin' && user.status === 'verified') {
          Loan.viewLoan().then((loans) => {
            if (!loans) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: 'No loan found',
              });
            } else {
              for (let i = 0; i < loans.length; i++) {
                if (loans[i].status === req.body.status && loans[i].repaid === req.body.repaid) {
                  currentLoans = loans[i];
                }
              }
              if (currentLoans.length < 1) {
                res.status(ST.BAD_REQUEST).send({
                  status: ST.BAD_REQUEST,
                  error: 'No loan found',
                });
              } else {
                res.status(200).send({
                  Status: 200,
                  Message: 'Loans found',
                  Data: currentLoans,
                });
              }
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
}

export default new LoanControler();
