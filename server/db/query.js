import { USER_VERIFIED, USER_ROLE_ADMIN , USER_ROLE_CLIENT , LOAN_PENDING, LOAN_REJECTED, LOAN_APPROVED } from '../utils/constants';

const queryString = {
  // Tables creations
  createUserTableQuery: `CREATE TABLE IF NOT EXISTS 
         users(id VARCHAR(100) PRIMARY KEY,
               firstName VARCHAR(50),
               lastName VARCHAR(50),
               email VARCHAR(50),
               address VARCHAR(50),
               createdOn VARCHAR(30),
               status VARCHAR(30),
               isadmin boolean,
               password VARCHAR(50)
               )`,
  createLoanApplicationTableQuery: `CREATE TABLE IF NOT EXISTS application(
                        id VARCHAR(100) PRIMARY KEY, 
                        user_email VARCHAR(100),
                        createdOn VARCHAR(30),
                        status VARCHAR(50),
                        repaid boolean,
                        tenor VARCHAR(10),
                        amount VARCHAR(10),
                        payment_installment VARCHAR (10),
                        interest VARCHAR(10)
                         )`,
  createLoanRepaymentTableQuery: `CREATE TABLE IF NOT EXISTS repayment(
                        id VARCHAR(100) PRIMARY KEY,
                        loan_id VARCHAR(100),
                        user_email VARCHAR(100),
                        created_on VARCHAR(30),
                        amount VARCHAR(50)
  )`,
  createLoanRepaymentHistoryTableQuery: `CREATE TABLE IF NOT EXISTS repayment_history(
    id VARCHAR(100) PRIMARY KEY,
    loan_id VARCHAR(100),
    user_email VARCHAR(100),
    created_on VARCHAR(30),
    paymentInstallment VARCHAR(30),
    amount VARCHAR(30),
    balance VARCHAR(30)
)`,
  signup: 'INSERT INTO users(id,firstName,lastName,email,address,createdOn,status,isadmin,password) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
  login: 'SELECT * FROM users WHERE email=$1',
  getAllUser: 'SELECT * FROM users',
  getUserById: 'SELECT * FROM users WHERE id = $1',
  getUserByEmail: 'SELECT * FROM users WHERE email=$1 ',
  verifyUser: 'UPDATE users SET status=$1 WHERE email=$2',
  checkIfUserIsVerified: `SELECT status FROM users WHERE email=$1 AND status='${USER_VERIFIED}'`,
  resetPassword: 'UPDATE users SET password=$1 WHERE email=$2',
  getUserByPassword: 'SELECT * FROM users where password=$1',
  getAdminUser: `SELECT * FROM users where isadmin=${USER_ROLE_ADMIN}`,
  getClientUser: `SELECT * FROM users where isadmin=${USER_ROLE_CLIENT}`,
  getClientUserByEmail: `SELECT * FROM users where isadmin=${USER_ROLE_CLIENT} AND email=$1`,
  apply: `INSERT INTO application
  (id,user_email,createdOn,status,repaid,tenor,amount,payment_installment,interest)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
  postLoanRepaymentHistoryQuery: 'INSERT INTO repayment_history(id,loan_id,user_email,created_on,paymentInstallment,amount,balance) VALUES($1,$2,$3,$4,$5,$6,$7)',
  repayLoanQuery: 'INSERT INTO repayment(id,loan_id,user_email,created_on,amount) VALUES($1,$2,$3,$4,$5)',
  viewSpecLoanQuery: 'SELECT * FROM application WHERE id=$1',
  viewLoansQuery: 'SELECT * FROM application',
  getLoanByUserEmailQuery: 'SELECT * from application WHERE user_email=$1',
  getMyLoanRepaymentHistory: 'SELECT * FROM repayment_history WHERE loan_id=$1 AND user_email=$2',
  approveLoanQuery: 'UPDATE application SET status=$1',
  vewCurrentOrRepaidLoanQuery: 'SELECT * FROM application WHERE status=$1 AND repaid=$2',
  getLoanById: 'SELECT * FROM application WHERE id=$1',
};
export default queryString;
