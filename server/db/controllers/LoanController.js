/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import joi from 'joi';
import uuidv4 from 'uuid/v4';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Validator from '../../utils/validation';
import ST from '../../utils/status';
import MSG from '../../utils/res_messages';
import queryString from '../query';
import QueryExecutor from '../exec';
import CreateTables from '../create/db';

let paidAm = 0;
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

  async approveOrReject(req, res) {
    joi.validate(req.body, Validator.Validate.approveOrRejectSchema).then(() => {
      QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
        if (userResult.rows[0].isadmin === true && userResult.rows[0].status === 'verified') {
          QueryExecutor.queryParams(queryString.getLoanById, [req.params.id]).then((loanResult) => {
            if (loanResult.rows[0]) {
              if (loanResult.rows[0].status === 'pending') {
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
                const loanStatus = req.body.status;
                let mailOptions = null;
                QueryExecutor.queryParams(queryString.approveLoanQuery, [loanStatus]).then((apprResult) => {
                  if (apprResult) {
                    res.status(ST.OK).send({
                      Status: ST.OK,
                      message: `Loan is ${loanStatus} Successfully and this client will receive approval or rejection email`,
                    });
                  }
                });
                const output = `<html>
                <body>
                <h3 style={color:blue}>Hello Quick credit user</h3>
                <p> We are informing you that your loan application is ${loanStatus}.</p>
                </body>
                </html>`;
                if (loanStatus === 'approved') {
                  mailOptions = {
                    from: 'Quick credit',
                    to: loanResult.rows[0].user_email,
                    subject: 'Quick credit loan application approval',
                    html: output,
                  };

                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(`Email sent: ${info.response}`);
                    }
                  });
                } else {
                  mailOptions = {
                    from: process.env.QUICK_CREDIT_EMAIL,
                    to: loanResult.rows[0].user_email,
                    subject: 'Quick credit loan application rejection',
                    html: output,
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(`Email sent: ${info.response}`);
                    }
                  });
                }
              } else {
                res.status(ST.NOT_FOUND).send({
                  status: ST.NOT_FOUND,
                  error: 'No pending loan found !',
                });
              }
            } else {
              res.status(ST.NOT_FOUND).send({
                status: ST.NOT_FOUND,
                error: `No loan found with id ${req.params.id} !`,
              });
            }
          });
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: 'You are not admin or not verified!',
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async viewCurrentLoan(req, res) {
    QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
      if (userResult.rows[0].isadmin === true && userResult.rows[0].status === 'verified') {
        QueryExecutor.queryParams(queryString.vewCurrentLoan, []).then((loanResult) => {
          if (loanResult.rows) {
            res.status(ST.OK).send({
              Status: ST.OK,
              data: {
                message: `${loanResult.rows.length} Current loan(s) found`,
                loans: loanResult.rows,
              },
            });
          } else {
            res.status(ST.NOT_FOUND).send({
              status: ST.NOT_FOUND,
              error: 'No current loans found!',
            });
          }
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'You are not admin or not verified!',
        });
      }
    });
  }

  async viewSpec(req, res) {
    QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
      if (userResult.rows[0].isadmin === true && userResult.rows[0].status === 'verified') {
        QueryExecutor.queryParams(queryString.getLoanById, [req.params.id]).then((loanResult) => {
          if (loanResult.rows[0]) {
            res.status(ST.OK).send({
              Status: ST.OK,
              data: {
                message: 'Loan found',
                loans: loanResult.rows[0],
              },
            });
          } else {
            res.status(ST.NOT_FOUND).send({
              status: ST.NOT_FOUND,
              error: `No loan foud  found with id ${req.params.id}!`,
            });
          }
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'You are not admin or not verified!',
        });
      }
    });
  }

  async viewRepaidLoan(req, res) {
    QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
      if (userResult.rows[0].isadmin === true && userResult.rows[0].status === 'verified') {
        QueryExecutor.queryParams(queryString.vewRepaidLoan, []).then((loanResult) => {
          if (loanResult.rows[0]) {
            res.status(ST.OK).send({
              Status: ST.OK,
              data: {
                message: `${loanResult.rows.length} repaid loan(s) found`,
                loans: loanResult.rows,
              },
            });
          } else {
            res.status(ST.NOT_FOUND).send({
              status: ST.NOT_FOUND,
              error: 'No repaid loans found!',
            });
          }
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'You are not admin or not verified!',
        });
      }
    });
  }

  async repayLoan(req, res) {
    joi.validate(req.body, Validator.Validate.repayLoanSchemaV2).then(() => {
      QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((result) => {
        if (result.rows[0].isadmin === false) {
          QueryExecutor.queryParams(queryString.getLoanByUserEmailQuery, [req.body.userEmail]).then((loanResult) => {
            if (!loanResult.rows[0]) {
              res.status(ST.BAD_REQUEST).send({
                status: ST.BAD_REQUEST,
                error: `No laon found for user ${req.body.userEmail}`,
              });
            } else {
              QueryExecutor.queryParams(queryString.viewCurrentLoanByEmail, [req.body.userEmail]).then((currentLoanResult) => {
                if (currentLoanResult.rows[0]) {
                  const { paidAmount } = req.body;
                  let repaid = false;
                  if (loanResult.rows[0].amount < 1) {
                    repaid = true;
                  }
                  paidAm = paidAmount;
                  balance = loanResult.rows[0].amount - paidAm;
                  const loanRepayment = [uuidv4(), currentLoanResult.rows[0].id, req.body.userEmail, formatedDate, paidAm];
                  QueryExecutor.queryParams(queryString.repayLoanQuery, loanRepayment).then((repayResult) => {
                    if (repayResult.rows) {
                      QueryExecutor.queryParams(queryString.updateLoan, [balance, repaid, currentLoanResult.rows[0].id]).then((updateResult) => {
                        if (updateResult.rows) {
                          res.status(ST.OK).send({
                            status: ST.OK,
                            message: `Loan repayment is successfully done, previous amount was ${loanResult.rows[0].amount} now you remain with ${balance} of loan`,
                          });
                        }
                      });
                    } else {
                      res.status(ST.BAD_REQUEST).send({
                        status: ST.BAD_REQUEST,
                        error: 'Unknown error',
                      });
                    }
                  });
                } else {
                  res.status(ST.NOT_FOUND).send({
                    status: ST.NOT_FOUND,
                    error: 'Loan current not found, maybe this loan is repaid!',
                  });
                }
              });
            }
          });
        } else {
          res.status(ST.NOT_FOUND).send({
            status: ST.NOT_FOUND,
            message: MSG.MSG_ACCESS_DENIED,
            error: 'Only client are allowed to repay loans',
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async postRepay(req, res) {
    joi.validate(req.body, Validator.Validate.postRepaymentScemaV2).then(() => {
      QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
        if (userResult.rows[0].isadmin === true && userResult.rows[0].status === 'verified') {
          QueryExecutor.queryParams(queryString.viewCurrentLoanByEmail, [req.body.userEmail]).then((clientLoanResult) => {
            if (clientLoanResult.rows[0]) {
              const loanRepay = [uuidv4(), clientLoanResult.rows[0].id, req.body.userEmail, formatedDate, clientLoanResult.rows[0].payment_installment, req.body.paidAmount, clientLoanResult.rows[0].amount];
              QueryExecutor.queryParams(queryString.postLoanRepaymentHistoryQuery, loanRepay).then((postResult) => {
                if (postResult) {
                  res.status(ST.OK).send({
                    status: ST.OK,
                    message: 'You\'ve successfully posted loan repayment to client',
                  });
                } else {
                  res.status(ST.BAD_REQUEST).send({
                    status: ST.BAD_REQUEST,
                    message: 'Loan not posted successfully',
                  });
                }
              });
            } else {
              res.status(ST.NOT_FOUND).send({
                status: ST.NOT_FOUND,
                message: `No current loan found for user ${req.body.userEmail}`,
              });
            }
          });
        } else {
          res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            message: MSG.MSG_UNAUTHORIZED_ADMIN_ERROR,
          });
        }
      });
    }).catch(error => res.send({
      status: 400,
      error: { message: error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') },
    }));
  }

  async viewRepayHistory(req, res) {
    QueryExecutor.queryParams(queryString.getUserById, [req.user.id]).then((userResult) => {
      if (userResult.rows[0].isadmin === false) {
        QueryExecutor.queryParams(queryString.getMyLoanRepaymentHistory, [userResult.rows[0].email]).then((loanResult) => {
          if (loanResult.rows[0]) {
            res.status(ST.OK).send({
              status: ST.OK,
              data: {
                message: `${loanResult.rows.length} record(s) found`,
                loans: loanResult.rows,
              },
            });
          } else {
            res.status(ST.BAD_REQUEST).send({
              status: ST.BAD_REQUEST,
              error: 'No loan found',
            });
          }
        });
      } else {
        res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: MSG.MSG_NOT_CLIENT,
        });
      }
    });
  }
}
export default new LoanC();
