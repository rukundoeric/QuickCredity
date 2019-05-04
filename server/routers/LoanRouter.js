/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import express from 'express';
import LoanControler from '../controlers/loan';
import auth from '../utils/auth';

const loanRouter = express.Router();
// ROuters for models(V1)
loanRouter.post('/api/v1/loans/apply', auth.verifyToken, LoanControler.applyForLoan);
loanRouter.get('/api/v1/loans', auth.verifyToken, LoanControler.getAllLoanApplications);
loanRouter.get('/api/v1/loans/repaid', auth.verifyToken, LoanControler.viewRepaidLoans);
loanRouter.get('/api/v1/loans/current', auth.verifyToken, LoanControler.viewCurrentLoans);
loanRouter.patch('/api/v1/loans/approveorreject/:id', auth.verifyToken, LoanControler.approveOrReject);
loanRouter.post('/api/v1/loans/:id/repayment', auth.verifyToken, LoanControler.repayLoan);
loanRouter.get('/api/v1/loans/:id/repayments', auth.verifyToken, LoanControler.viewRepHistory);
loanRouter.post('/api/v1/loans/postrepayhistory', auth.verifyToken, LoanControler.postRepayHistory);
export default loanRouter;
