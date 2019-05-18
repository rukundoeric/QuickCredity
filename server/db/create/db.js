/* eslint-disable no-empty-function */
/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
/* eslint-disable max-len */


import pg from 'pg';
import dotenv from 'dotenv';
import con from '../connect/con_file';
import queryString from '../query';
import pool from '../connect/connection';
// const config = {
//   user: 'DannyAdmin',
//   database: 'quick-credit',
//   password: 'DannyPro123',
//   port: 5432,
// };

// // dotenv.config();

// const pool = new pg.Pool(config);
class CreateTables {
  constructor() {
    pool.query(queryString.createUserTableQuery).then((res) => {
      console.log('User Table Created Successfully');
    }).catch((err) => {
      console.log(err);
    });
    pool.query(queryString.createLoanApplicationTableQuery).then((res) => {
      console.log('Loan appication table  Table Created Successfully');
    }).catch((err) => {
      console.log(err);
    });
    pool.query(queryString.createLoanRepaymentTableQuery).then((res) => {
      console.log('Loan repayment table is Created Successfully');
    }).catch((err) => {
      console.log(err);
    });
    pool.query(queryString.createLoanRepaymentHistoryTableQuery).then((res) => {
      console.log('Laon repayment history Table Create Successfully');
    }).catch((err) => {
      console.log(err);
    });
  }
}

export default new CreateTables();
