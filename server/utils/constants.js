const apiV1RootUsers = '/api/v1/';
const apiV1RootLoans = '/api/v1/loans/';
const textEmail = 'benshidanny11@gmail.com';

// All urls for api v1 user
const apiUrlv1authLogin = `${apiV1RootUsers}auth/login`;
const apiV1userSignup = '/api/v1/auth/signup';
const apiV1GetAllUsers = `${apiV1RootUsers}users`;
const apiUrlv1verfyUser = `${apiV1RootUsers}${apiV1GetAllUsers}`;
const apiV1ResetPassword = `${apiV1RootUsers}${apiV1GetAllUsers}/reset`;
// All urls for api loan
const apiUrlv1applyForLoan = `${apiV1RootLoans}apply`;
const apiUrlv1getAllLoanApplications = `${apiV1RootLoans}loans`;
const apiUrlv1viewRepaidLoans = `${apiV1RootLoans}repaid`;
const apiUrlv1viewCurrentLoans = `${apiV1RootLoans}current`;
const apiUrlv1approveOrReject = `${apiV1RootLoans}approveorreject/:id`;
const apiUrlv1repayLoan = `${apiV1RootLoans}:id/repayment`;
const apiUrlv1viewRepHistory = `${apiV1RootLoans}:id/repayments`;
const apiUrlv1postRepayHistory = `${apiV1RootLoans}postrepayhistory`;
const welcomApi = 'http://localhost:5060/';
const USER_VERIFIED = 'verified';
const USER_ROLE_ADMIN = true;
const USER_ROLE_CLIENT = false;
const LOAN_PENDING = 'pending';
const LOAN_REJECTED = 'rejected';
const LOAN_APPROVED = 'approved';
const LOAN_REPAID=true;
const LOAN_NOT_REPAID=false;

export {
  apiUrlv1authLogin,
  apiV1userSignup,
  apiV1GetAllUsers,
  apiUrlv1verfyUser,
  apiV1ResetPassword,
  apiUrlv1applyForLoan,
  apiUrlv1getAllLoanApplications,
  apiUrlv1viewRepaidLoans,
  apiUrlv1viewCurrentLoans,
  apiUrlv1approveOrReject,
  apiUrlv1repayLoan,
  apiUrlv1viewRepHistory,
  apiUrlv1postRepayHistory,
  welcomApi,
  textEmail,
  USER_VERIFIED,
  USER_ROLE_ADMIN,
  USER_ROLE_CLIENT,
  LOAN_PENDING,
  LOAN_REJECTED,
  LOAN_APPROVED,
  LOAN_REPAID,
  LOAN_NOT_REPAID,
};
