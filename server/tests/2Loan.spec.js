/* eslint-disable no-console */
/* eslint-disable no-undef */
import chai, { expect } from 'chai';

import chaihttp from 'chai-http';
import Request from 'request';
import LoanControler from '../controlers/User';
import LoanModel from '../models/LoanModel';
import startServer from '../system-root/server';
import {
  apiUrlv1applyForLoan, apiUrlv1repayLoan, apiUrlv1getAllLoanApplications, apiUrlv1viewRepaidLoans,
  apiUrlv1viewCurrentLoans, apiUrlv1approveOrReject, apiUrlv1viewRepHistory, apiUrlv1postRepayHistory,
  adminLogin, clientLogin, apiUrlv1authLogin,
} from '../utils/constants';

let clientToken;
let adminToken;
chai.use(chaihttp);

const serverUrl = 'http://localhost:5060';

describe('Loan', () => {
  let server;
  before(async (done) => {
    server = startServer(5060);
    done();
  });
  after(async (done) => {
    server.close();
    done();
  });
  describe('POST /api/v1/auth/login (Any user)', () => {
    it('Should Return 200 if admin user is logged in', (done) => {
      chai.request(serverUrl)
        .post('/api/v1/auth/login')
        .send({ email: 'dukuze11@gmail.com', password: 'emmy12345' }).end((err, res) => {
          adminToken = res.body.Token;
          expect(res).to.have.status(200);
          console.log(`Client token ${adminToken}`);
        });
      done();
    });
    it('Should Return 200 if client user is logged in', (done) => {
      chai.request(serverUrl)
        .post('/api/v1/auth/login')
        .send({ email: 'dannykamo2023@gmail.com', password: 'kamoso123' }).end((err, res) => {
          clientToken = res.body.Token;
          expect(res).to.have.status(200);
          console.log(`Admin token ${clientToken}`);
        });
      done();
    });
  });

  describe('Laon model tests', () => {
    it('Should return an array list of all existing loans', () => {
      expect(LoanModel.loanData[0]).to.deep.equal({
        id: 'jksd83w72kjsd0die7728ujdj98e8',
        userEmail: 'benshidanny11@gmail.com',
        status: 'pending',
        repaid: false,
        tanor: 6,
        amount: 1000000,
        paymentInstallment: 20000,
        balance: 1000000,
        interest: 200000,
      });
    });
    it('Should return true if  loan application is successfull', () => {
      LoanModel.applyforLoan({
        id: 'jksd83w72kjsd0die7728ujdj98e8',
        userEmail: 'benshidanny11@gmail.com',
        status: 'pending',
        repaid: false,
        tanor: 6,
        amount: 1000000,
        paymentInstallment: 20000,
        balance: 1000000,
        interest: 200000,
      }).then((res) => {
        expect(res).to.equal(true);
      });
    });
    it('Should return false if  loan application arguments is not valid', () => {
      LoanModel.applyforLoan(null).then((res) => {
        expect(res).to.equal(false);
      });
    });
    it('Should return  one loan object if email  is correct', () => {
      LoanModel.getLoanByUserEmail('benshidanny11@gmail.com').then((res) => {
        expect(res).to.deep.equal({
          id: 'jksd83w72kjsd0die7728ujdj98e8',
          userEmail: 'benshidanny11@gmail.com',
          status: 'pending',
          repaid: false,
          tanor: 6,
          amount: 1000000,
          paymentInstallment: 20000,
          balance: 1000000,
          interest: 200000,
        });
      });
    });
    it('Should return  length for loan list', () => {
      LoanModel.viewLoan().then((res) => {
        expect(res.length).to.equal(6);
      });
    });
    it('Should return specific loan for provided id', () => {
      LoanModel.getSpecLoan('jksd83w72kjsd0die7728ujdj98e8').then((res) => {
        expect(res).to.deep.equal(
          {
            id: 'jksd83w72kjsd0die7728ujdj98e8',
            userEmail: 'benshidanny11@gmail.com',
            status: 'pending',
            repaid: false,
            tanor: 6,
            amount: 1000000,
            paymentInstallment: 20000,
            balance: 1000000,
            interest: 200000,
          },
        );
      });
    });
    it('Should return length of existing repayment history', () => {
      LoanModel.viewRepaymentHistory().then((res) => {
        expect(res.length).to.deep.equal(2);
        expect(res).to.be.an('array');
      });
    });
    it('Should return true if loan repayment is posted', () => {
      LoanModel.postRepayHistory(
        {
          id: 'jd99e2ud89jeje99iy60e099e0',
          loanId: 'jksd83wrgjsd0909398e8hd8rf',
          userEmail: 'dannykamo2023@gmail.com',
          createdOn: '4/5/2019',
          monthlyInstallment: 200000,
          amount: 1000000,
          paidAmount: 200000,
        },
      ).then((res) => {
        expect(res).to.equal(true);
      });
    });
    it('Should return false if loan repayment parameter is null', () => {
      LoanModel.postRepayHistory(null).then((res) => {
        expect(res).to.equal(false);
      });
    });
  });
  describe('Loan routers', () => {
    describe(`GET ${apiUrlv1getAllLoanApplications} (Admin)`, () => {
      it('Should return 400 if user is not admin', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans')
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
          //  console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should return 200 if user is  admin', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans')
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            //   console.log(res.body);
            expect(res).to.have.status(200);
          });
        done();
      });
    });
    describe('GET api/v1/loans/specific/:id (Admin)', () => {
      it('Should return 400 if user is not admin', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/specific/jksd83w72kjsd0909398e8hd89w9')
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
          //   console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should return 404 if loan doesnt exist', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/specific/jksd83w72kjsd0909398e8hd89w923')
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should return 200 loan is found successfully', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/specific/jksd83w72kjsd0909398e8hd89w9')
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            //  console.log(res.body);
            expect(res).to.have.status(200);
          });
        done();
      });
    });
    describe('GET api/v1/loans/repaid (Admin)', () => {
      it('Should return 200 if loan found', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/repaid')
          .send({ status: 'approved', repaid: true })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(200);
          });
        done();
      });
      it('Should return 400 if user is not admin', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/repaid')
          .send({ status: 'approved', repaid: true })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should return 404 if loan not found ', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/repaid')
          .send({ status: 'approved1', repaid: true })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should return 400 status code if input fields are not valid', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/repaid')
          .send({ status: 're', repaid: 'f' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
    });
    describe('GET api/v1/loans/current (Admin)', () => {
      it('Should return 400 if loan input fields are not correct', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/current')
          .send({ status: 'a' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should return 400 if loan user is not admin', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/current')
          .send({ status: 'approved', repaid: false })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should return 200 if current loan is found', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/current')
          .send({ status: 'approved', repaid: false })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.Status).to.equal(200);
          });
        done();
      });
      it('Should return 400 if current loans are found', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/current')
          .send({ status: 'approved', repaid: false })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.Status).to.equal(200);
          });
        done();
      });
      it('Should return 404 if current loans are not found', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/current')
          .send({ status: 'approved111', repaid: false })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
    });
    describe('PATCH api/v1/loans/approveorreject/:id (Admin)', () => {
      it('Shold 400 if status field is not valid', (done) => {
        chai.request(serverUrl)
          .patch('/api/v1/loans/approveorreject/jksd83w72kjsd0die7728ujdj98e8')
          .send({ status: 'a' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Shold 400 if status field is not valid', (done) => {
        chai.request(serverUrl)
          .patch('/api/v1/loans/approveorreject/jksd83w72kjsd0die7728ujdj98e8')
          .send({ status: 'a' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 400 if user is not admin', (done) => {
        chai.request(serverUrl)
          .patch('/api/v1/loans/approveorreject/jksd83w72kjsd0die7728ujdj98e8')
          .send({ status: 'approved' })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 400 if no pending loan found', (done) => {
        chai.request(serverUrl)
          .patch('/api/v1/loans/approveorreject/jksd83w72kjsd0909398e8hd89w9')
          .send({ status: 'approved' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 200 if loan is approved successfully', (done) => {
        chai.request(serverUrl)
          .patch('/api/v1/loans/approveorreject/jksd83w72kjsd0die7728ujdj98e8')
          .send({ status: 'approved' })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(res.body);
            expect(res).to.have.status(200);
          });
        done();
      });
    });
    describe('POST api/v1/loans/:id/repayment (Client)', () => {
      it('Shold 400 if paidamapunt field is not valid', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/jksd83w72kjsd0909398e8hd89w9/repayment')
          .send({ })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Shold 400 if user is not client', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/jksd83w72kjsd0909398e8hd89w9/repayment')
          .send({ paidAmount: 20000 })
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Shold 200 if loan is repaid', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/jksd83w72kjsd0909398e8hd89w9/repayment')
          .send({ paidAmount: 20000 })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(200);
          });
        done();
      });
      it('Shold 400 if no current loan found', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/jksd83wrgjsd0909398e8hd8rf/repayment')
          .send({ paidAmount: 20000 })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Shold 404 if loan id is invalid', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/jksd83wrgjsd0909398e8hd8rf121111/repayment')
          .send({ paidAmount: 20000 })
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
    });
    describe('GET api/v1/loans/:id/repayments (Client)', () => {
      it('Should 400 if user is not client', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/jd99e2ud89jeje99iy60e099e0/repayments')
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 404 if no loan found in clients favor', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/jd99e2ud89jeje99iy60e099e01211/repayments')
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 200 if  loan found in clients favor', (done) => {
        chai.request(serverUrl)
          .get('/api/v1/loans/jksd83wrgjsd0909398e8hd8rf/repayments')
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(200);
          });
        done();
      });
    });
    describe('POST /api/v1/loans/postrepayhistory (Admin)', () => {
      it('Should 400 if provided inputs are invalid', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({})
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 400 if user is not admin', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', clientToken)
          .send({ loanId: 'jksd83wrgjsd0909398e8hd8rf', userEmail: 'dannykamo2023@gmail.com', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should 404 if no client found with provided email', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({ loanId: 'jksd83wrgjsd0909398e8hd8rf', userEmail: 'dannykamo2023@gmail.com1111', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              // console.log(err);
            }
            // console.log(res.body);
            expect(res.body.Status).to.equal(404);
          });
        done();
      });
      it('Should 404 if no loan found with provided id', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({ loanId: 'jksd83wrgjsd0909398e8hd8rf12121', userEmail: 'dannykamo2023@gmail.com', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              // console.log(err);
            }
            // console.log(res.body);
            expect(res.body.Status).to.equal(404);
          });
        done();
      });
      it('Should 400 if provided email is not for client', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({ loanId: 'jksd83wrgjsd0909398e8hd8rf12121', userEmail: 'dukuze11@gmail.com', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              // console.log(err);
            }
            // console.log(res.body);
            expect(res.body.Status).to.equal(400);
          });
        done();
      });
      it('Should 400 if provided id if for pending or repaid loan', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({ loanId: 'jksd83wrgjsd0909398e8hd8rf', userEmail: 'dannykamo2023@gmail.com', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              // console.log(err);
            }
            // console.log(res.body);
            expect(res.body.Status).to.equal(400);
          });
        done();
      });
      it('Should 200 if loan repayment history is posted', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/postrepayhistory')
          .set('quck-credit-access-token', adminToken)
          .send({ loanId: 'jksd83wrgjsd09304330498h3r02f', userEmail: 'dannykamo2023@gmail.com', paidAmount: 20000 })
          .end((err, res) => {
            if (err) {
              // console.log(err);
            }
            // console.log(res.body);
            expect(res.body.Status).to.equal(200);
          });
        done();
      });
    });
    describe('POST api/v1/loans/apply(Client)', () => {
      it('Should return 400 if provided inputs are invalid', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/apply')
          .set('quck-credit-access-token', clientToken)
          .send({})
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should return 400 if user is not client', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/apply')
          .set('quck-credit-access-token', adminToken)
          .send({ userEmail: 'dannykamo2023@gmail.com', tenor: 5, amount: 2000 })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should return 400 if user alredy has a non repaid loan', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/apply')
          .set('quck-credit-access-token', clientToken)
          .send({ userEmail: 'dannykamo2023@gmail.com', tenor: 5, amount: 2000 })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(400);
          });
        done();
      });
      it('Should return 200 if loan is applied successfully', (done) => {
        chai.request(serverUrl)
          .post('/api/v1/loans/apply')
          .set('quck-credit-access-token', clientToken)
          .send({ userEmail: 'dannykamo20231@gmail.com', tenor: 5, amount: 2000 })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            // console.log(res.body);
            expect(res.body.status).to.equal(200);
          });
        done();
      });
    });
  });
});
