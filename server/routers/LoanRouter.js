/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import express from 'express';
import LoanControler from '../controlers/loan';
import auth from '../utils/auth';
import LoanC from '../db/controllers/LoanController';
import Auth from '../db/middleware/auth'

const loanRouter = express.Router();
// ROuters for models(V1)
loanRouter.post('/api/v1/loans/apply', auth.verifyToken, LoanControler.applyForLoan);
loanRouter.get('/api/v1/loans', auth.verifyToken, LoanControler.getAllLoanApplications);
loanRouter.get('/api/v1/loans/repaid', auth.verifyToken, LoanControler.viewRepaidLoans);
loanRouter.get('/api/v1/loans/current', auth.verifyToken, LoanControler.viewCurrentLoans);
loanRouter.get('/api/v1/loans/specific/:id', auth.verifyToken, LoanControler.getSpecLoan);
loanRouter.patch('/api/v1/loans/approveorreject/:id', auth.verifyToken, LoanControler.approveOrReject);
loanRouter.post('/api/v1/loans/:id/repayment', auth.verifyToken, LoanControler.repayLoan);
loanRouter.get('/api/v1/loans/:id/repayments', auth.verifyToken, LoanControler.viewRepHistory);
loanRouter.post('/api/v1/loans/postrepayhistory', auth.verifyToken, LoanControler.postRepayHistory);
// Routers for database apis(V2)
loanRouter.post('/api/v2/loans/apply', Auth.verifyToken, LoanC.applyForLoan);
loanRouter.patch('/api/v2/loans/approveorreject/:id', Auth.verifyToken, LoanC.approveOrReject);
loanRouter.get('/api/v2/loans/current', Auth.verifyToken, LoanC.viewCurrentLoan);
loanRouter.get('/api/v2/loans/repaid', Auth.verifyToken, LoanC.viewRepaidLoan);
loanRouter.post('/api/v2/loans/repay', Auth.verifyToken, LoanC.repayLoan);
loanRouter.post('/api/v2/loans/postrepay', Auth.verifyToken, LoanC.postRepay);
export default loanRouter;
