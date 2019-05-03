/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import express from 'express';
import LoanControler from '../controlers/loan';
import auth from '../utils/auth';

const loanRouter = express.Router();
// ROuters for models(V1)
loanRouter.post('/api/v1/loans/apply', auth.verifyToken, LoanControler.applyForLoan);
loanRouter.get('/api/v1/loans', auth.verifyToken, LoanControler.getAllLoanApplications);
loanRouter.get('/api/v1/loans/:id', auth.verifyToken, LoanControler.getSpecLoan);

export default loanRouter;
