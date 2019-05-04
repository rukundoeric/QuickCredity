/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
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

let paidAm = 0;
let balance = 0;

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
              balance = amount - paidAm;
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
              const status1 = (req.body.status === 'approved') ? 'approved' : '';
              const repaid1 = req.body.repaid !== false;
              for (let i = 0; i < loans.length; i++) {
                if (loans[i].status === status1 && status1 !== '' && loans[i].repaid === req.body.repaid && repaid1 !== true) {
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

  async approveOrReject(req, res) {
    joi.validate(req.body, Validator.Validate.approveOrRejectSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        if (user && user.userRole === 'admin' && user.status === 'verified') {
          Loan.viewLoan().then((loans) => {
            if (!loans) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: 'No loan found',
              });
            } else {
              let i;
              const loanStatus = req.body.status;
              if (loanStatus === 'rejected') {
              // Send rejected email to the client
              } else {
                // //Send approve email to the client
              }
              let newLoan = null;
              for (i = 0; i < loans.length; i++) {
                if (loans[i].id === req.params.id && loans[i].status === 'pending') {
                  loans[i].status = loanStatus;
                  newLoan = loans[i];
                }
              }
              if (newLoan === null) {
                res.status(ST.BAD_REQUEST).send({
                  status: ST.BAD_REQUEST,
                  error: 'No pending loan found for provided id',
                });
              } else {
                res.status(ST.OK).send({
                  Status: ST.OK,
                  Message: `Loan is ${loanStatus} Successfully`,
                  Data: newLoan,
                });
              }
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

  async repayLoan(req, res) {
    joi.validate(req.body, Validator.Validate.repayLoanSchema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        if (user && user.userRole === 'client' && user.status === 'verified') {
          Loan.getLoanByUserEmail(user.email).then((loan) => {
            if (!loan) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: 'You dont have a loan in loan list',
              });
            } else if (loan.userEmail === user.email) {
              Loan.getSpecLoan(req.params.id).then((loan) => {
                if (!loan) {
                  res.status(ST.BAD_REQUEST).send({
                    status: ST.BAD_REQUEST,
                    error: 'No loan found for provided id',
                  });
                } else if (loan.status === 'approved' && loan.repaid === false) {
                  const { paidAmount } = req.body;
                  paidAm = paidAmount;
                  balance = loan.amount - paidAm;
                  const loanRepayment = {
                    id: uuidv4(),
                    loanId: loan.id,
                    createdOn: new Date(),
                    Amount: loan.amount,
                    monthlyIntallment: loan.paymentInstallment,
                    paidAmount: paidAm,
                    Balance: balance,
                  };
                  res.status(ST.OK).send({
                    status: ST.OK,
                    MEssage: `You have successfully paid a loan with id: ${loan.id}`,
                    Data: loanRepayment,
                  });
                } else {
                  res.status(ST.BAD_REQUEST).send({
                    status: ST.BAD_REQUEST,
                    Error: 'May be your loan is not approved or is fully paid',
                  });
                }
              });
            } else {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                Error: 'This loan belongs to other client!',
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

  async viewRepHistory(req, res) {
    User.getUserById(req.user.id).then((user) => {
      if (user && user.userRole === 'client' && user.status === 'verified') {
        Loan.viewRepaymentHistory().then((history) => {
          if (!history) {
            res.status(ST.BAD_REQUEST).send({
              status: ST.BAD_REQUEST,
              error: 'No repayment history!',
            });
          } else {
            let i;
            let loanRepaymentHistory = null;
            for (i = 0; i < history.length; i++) {
              if (history[i].loanId === req.params.id && history[i].userEmail === user.email) {
                loanRepaymentHistory = {
                  LoanId: history[i].loanId,
                  createdOn: history[i].createdOn,
                  monthlyIntallment: history[i].monthlyInstallment,
                  Amount: history[i].paidAmount,
                };
              }
            }
            if (loanRepaymentHistory !== null) {
              res.status(ST.OK).send({
                status: ST.OK,
                MEssage: 'History found',
                Data: loanRepaymentHistory,
              });
            } else {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                Error: 'No repayment history in your favor',
              });
            }
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
  }

  async postRepayHistory(req, res) {
    joi.validate(req.body, Validator.Validate.postRepaymentScema).then(() => {
      User.getUserById(req.user.id).then((user) => {
        if (user && user.userRole === 'admin' && user.status === 'verified') {
          User.getUserByEmail(req.body.userEmail).then((user) => {
            if (!user) {
              res.send({
                Status: ST.NOT_FOUND,
                Error: `No client found with the email ${req.body.userEmail} `,
              });
            } else if (user.userRole === 'client') {
              Loan.getSpecLoan(req.body.loanId).then((loan) => {
                if (!loan) {
                  res.send({
                    Status: ST.NOT_FOUND,
                    Error: 'May be loan is not found, not approved or is fully repaid',
                  });
                } else if (loan.status === 'approved' && loan.repaid === false) {
                  const loanRepay = {
                    Id: uuidv4(),
                    loanId: loan.id,
                    UserEmail: req.body.userEmail,
                    createdOn: new Date(),
                    paymentInstallment: loan.paymentInstallment,
                    paidAmount: req.body.paidAmount,
                  };
                  Loan.postRepayHistory(loanRepay).then((historyposted) => {
                    if (historyposted) {
                      res.status(ST.OK).send({
                        Status: ST.OK,
                        Message: 'Repaymet posted successfully',
                        Data: loanRepay,
                      });
                    } else {
                      res.send({
                        Status: ST.BAD_REQUEST,
                        Error: 'Repayment not posted, try again later!',
                      });
                    }
                  });
                } else {
                  res.send({
                    Status: ST.BAD_REQUEST,
                    Error: 'No client found!',
                  });
                }
              });
            } else {
              res.send({
                Status: ST.BAD_REQUEST,
                Error: `No client found! with email ${req.body.userEmail}`,
              });
            }
          });
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            Message: MSG.MSG_ACCESS_DENIED,
            error: MSG.MSG_UNAUTHORIZED_ADMIN_ERROR,
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
}

export default new LoanControler();
