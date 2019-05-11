/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import { expect } from 'chai';
import chai from 'chai';
import chaihttp from 'chai-http';
import Request from 'request';
import userModel from '../models/UserModel';
import startServer from '../system-root/server';
import {
  apiUrlv1authLogin, apiV1GetAllUsers, apiUrlv1verfyUser, apiV1ResetPassword, apiV1userSignup, welcomApi,
} from '../utils/constants';
import {
  adminLoginBadEmail, adminLoginIncorrectPass, clientLoginIncorrectPass, loginWithouttoken, userEmail, clientUserId,
  adminUserId, invalidId, signUpAdminData, signUpClientData, adminLogin, clientLogin, adminData, adminDataBad, incompleteDataLogin, textEmail,
} from './data-helpers/helper';
import UserModel from '../models/UserModel';
import User from '../controlers/User';

const serverUrl = 'http://localhost:5060';
let adminToken;
let clientToken;

chai.use(chaihttp);
describe('User', () => {
  describe('User model', () => {
    it('Should return length of data list', () => {
      expect(userModel.userData.length).to.equal(3);
    });
    it('Should return a type of list', () => {
      expect(userModel.type).to.deep.equal({ type: 'UserList' });
    });
    it('Should Return a list of all Users or return null if array is empty', (done) => {
      userModel.getAllUsers().then((res) => {
        if (res.length > 0) {
          expect(typeof (res)).to.be('object');
          expect(res[0].id).to.not.be('undefined');
        } else {
          expect(res).toBe([]);
        }
        done();
      }).catch(() => done());
    });
    it('Should Return a one user by email if email is correct or null object if not', (done) => {
      userModel.getUserByEmail('benshidanny11@gmail.com').then((res) => {
        if (res) {
          expect(typeof (res)).to.be('object');
          expect(res.firstName).to.deep.equal('Urimubenshi');
        } else {
          expect(res).toBe(null);
        }
        done();
      }).catch(() => done());
    });
    it('Should Return null if email does not exist', (done) => {
      userModel.getUserByEmail('benshidanny11@gmail2.com').then((res) => {
        expect(res).toBe(null);
        done();
      }).catch(() => done());
    });
    it('Should Return a one user by id if id is correct or null object if not', (done) => {
      userModel.getUserById('klsfks8389334iaa9o99272jua90902').then((res) => {
        if (res) {
          expect(typeof (res)).to.be('object');
          expect(res.firstName).to.deep.equal('Dukuze');
          expect(res.userRole).to.deep.equal('admin');
        } else {
          expect(res).toBe(null);
        }
        done();
      }).catch(() => done());
    });
    it(' return false if User   is not valid, or true otherwise', (done) => {
      userModel.signup(
        {
          id: 'klsfks8389qhkiaa9o99272jua90902',
          firstName: 'Danny',
          lastName: 'Kamoso',
          email: 'dannykamo2023@gmail.com',
          address: 'Kimironko',
          createdOn: '4/28/2019',
          userRole11: 'client',
          password: 'kamoso123',
          status1: 'verified',
        },
      ).then((res) => {
        if (res) {
          expect(res).toBe(false);
        } else {
          expect(res).toBe(true);
        }
        done();
      }).catch(() => done());
    });
  });
  describe('User routers', () => {
    let server;
    before(async (done) => {
      server = startServer(5060);
      done();
    });
    after(async (done) => {
      server.close();
      done();
    });
    describe('Welcom user', () => {
      it('/Welome', (done) => {
        Request.get('/', { json: true }, (err, res, body) => {
          if (!err) {
            expect(body.Status).to.equal(200);
          }
        });
        done();
      });
    });
    describe('POST /api/v1/auth/signup (Any user)', () => {
      it('Should Return 201 if admin user is  created ', (done) => {
        chai.request(serverUrl)
          .post(apiV1userSignup)
          .set('X-API-Key', 'foobar')
          .set('Accept', 'application/json')
          .send(signUpAdminData)
          .end((req, res) => {
            adminToken = res.body.Token;
            expect(res).to.have.status(201);
          });
        done();
      });
      it('Should Return 201 if client user is  created ', (done) => {
        chai.request(serverUrl)
          .post(apiV1userSignup)
          .set('X-API-Key', 'foobar')
          .set('Accept', 'application/json')
          .send(signUpClientData)
          .end((req, res) => {
            clientToken = res.body.Token;
            expect(res).to.have.status(201);
          });
        done();
      });
      it('Should Return 400 if user already exist', (done) => {
        chai.request(serverUrl)
          .post(apiV1userSignup)
          .set('X-API-Key', 'foobar')
          .set('Accept', 'application/json')
          .send({
            firstName: 'Dukuze',
            lastName: 'Emmy',
            email: 'dukuze11@gmail.com',
            address: 'Kimironko',
            userRole: 'admin',
            password: 'emmy1234567',
          })
          .end((req, res) => {
            // console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });

      it('Should Return 400 if inputs are wrong', (done) => {
        chai.request(serverUrl)
          .post(apiV1userSignup)
          .set('X-API-Key', 'foobar')
          .set('Accept', 'application/json')
          .send({
            firstName: 'Dukuze',
            lastName: 'Emmy',
            email: 'dukuze11gmail.com',
            address: 'Kimironko',
            userRole: 'admin',
            password: 'emmy',
          })
          .end((req, res) => {
            // console.log(res.body);
            expect(res).to.have.status(400);
          });
        done();
      });
      it(' return false if provided arguments is null for signup', (done) => {
        userModel.signup(null).then((res) => {
          expect(res).to.equal(false);
          done();
        }).catch(() => done());
      });
      it(' return false 404 when some fields are missing', (done) => {
        userModel.signup(adminDataBad).then((res) => {
          expect(res).to.have.status(404);
          done();
        }).catch(() => done());
      });
    });
    // Login tests
    describe('POST /api/v1/auth/login (Any user)', () => {
      it('Should Return 200 if admin user is logged in', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send(adminLogin).end((err, res) => {
            adminToken = res.body.Token;
            expect(res).to.have.status(200);
            // console.log(`Admin token ${adminToken}`);
          });
        done();
      });
      it('Should Return 200 if client user is logged in', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send(clientLogin).end((err, res) => {
            clientToken = res.body.Token;
            expect(res).to.have.status(200);
            // console.log(`Client token ${clientToken}`);
          });
        done();
      });
      it('Response must contain user data if user is logged in', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send({
            email: 'benshidanny11@gmail.com',
            password: 'danny123',
          }).end((req, res) => {
            expect(res).to.have.status(200);
          });
        done();
      });
      it('Should Return 400 if user password is incorrect', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send({
            email: 'benshidanny11@gmail.com',
            password: 'danny123233',
          }).end((err, res) => {
            expect(res).to.have.status(400);
          });
        done();
      });
      it('Should Return 404 if user email is incorrect', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send({
            email: 'benshidanny11@gmail.com121',
            password: 'danny123',
          }).end((err, res) => {
            expect(res).to.have.status(404);
          });
        done();
      });
      it('Should Return 200 if user email and password are correct', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send(adminLogin).end((err, res) => {
            // console.log(res.body.Data);
            expect(res).to.have.status(200);
          });
        done();
      });
      it('Should Return 400 if input fields are incorect', (done) => {
        chai.request(serverUrl)
          .post(apiUrlv1authLogin)
          .send({
            email: 'erygthyhgthghgh',
            password: 'rfhhryy',
          }).end((err, res) => {
            // console.log(res.body.Data);
            expect(res).to.have.status(200);
          });
        done();
      });
    });
    describe('GET /api/v1/users (Admin)', () => {
      it('Should Return  array object of all users', (done) => {
        chai.request(serverUrl)
          .get(apiV1GetAllUsers)
          .end((err, res) => {
            expect(res.body).to.be.an('object');
          });
        done();
      });
      it('Should Return 200 if user role is admin', (done) => {
        chai.request(serverUrl)
          .get(apiV1GetAllUsers)
          .set('quck-credit-access-token', adminToken)
          .end((err, res) => {
            // console.log(`User id: ${res.body.ID}`);
            expect(res).to.have.status(200);
          });
        done();
      });
      it('Should Return 400 if user role is not admin', (done) => {
        chai.request(serverUrl)
          .get(apiV1GetAllUsers)
          .set('quck-credit-access-token', clientToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
          });
        done();
      });
    });
    describe('PATCH /api/v1/users/verify/:id (Admin)', () => {
      it('Should return 404 status if user email to be verified is incorrect', (done) => {
        Request.patch(`${serverUrl}/api/v1/users/verify/gprestein055@gmail.com`, { json: true, form: { status: 'verified' }, headers: { 'quck-credit-access-token': adminToken } }, (err, res, body) => {
          if (!err) {
            // console.log("body");
            expect(body.status).to.equal(404);
          } else {
            console.log(err);
          }
        });
        done();
      });
      it('Should return 200 if user is verified', (done) => {
        Request.patch(`${serverUrl}/api/v1/users/verify/benshidanny11@gmail.com`, { json: true, form: { status: 'verified' }, headers: { 'quck-credit-access-token': adminToken } }, (err, res, body) => {
          if (!err) {
            // console.log(`${textEmail}`);
            expect(body.status).to.equal(200);
          }
        });
        done();
      });
      it('Should return 400 if user verifier is not admin', (done) => {
        Request.patch(`${serverUrl}/api/v1/users/verify/${textEmail}`, { json: true, form: { status: 'verified' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            // console.log(body);
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
      it('Should return 400 if user status field is invalid', (done) => {
        Request.patch(`${serverUrl}/api/v1/users/verify/${textEmail}`, { json: true, form: { status: 'v' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            // console.log(body);
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
    });

    describe('POST /api/v1/users/reset (Any user)', () => {
      it('Should return 404 status code if provided data is incorrect', (done) => {
        chai.request(serverUrl)
          .post(apiV1ResetPassword)
          .end((err, res) => {
            expect(res).to.have.status(404);
          });
        done();
      });
      it('Should return 400 status code if data is incomplete', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: {}, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
      it('Should return 200 status code password is reset', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: { oldPassword: 'danny123', newPassword: 'Danny1234', confirmPassword: 'Danny1234' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(200);
          }
        });
        done();
      });
      it('Should return 400 status code if old password is incorrect', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: { oldPassword: 'danny123112', newPassword: 'Danny1234', confirmPassword: 'Danny1234' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
      it('Should return 400 status code if cofirm password  doesnt match to new password', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: { oldPassword: 'danny123', newPassword: 'Danny1234', confirmPassword: 'Danny12342322' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
    });
    describe('POST /api/v1/users/reset (Any user)', () => {
      it('Should return 404 status code if provided data is incorrect', (done) => {
        chai.request(serverUrl)
          .post(apiV1ResetPassword)
          .end((err, res) => {
            expect(res).to.have.status(404);
          });
        done();
      });
      it('Should return 400 status code if data is incomplete', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: {}, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
      it('Should return 200 status code password is reset', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, {
          json: true,
          form: {
            oldPassword: 'shadia1234',
            newPassword: 'shadia123411',
            confirmPassword: 'shadia123411',
          },
          headers: { 'quck-credit-access-token': adminToken },
        },
        (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(200);
          }
        });
        done();
      });
      it('Should return 400 status code if old password is incorrect', (done) => {
        Request.post(`${serverUrl}/api/v1/users/reset`, { json: true, form: { oldPassword: 'danny123112', newPassword: 'Danny1234', confirmPassword: 'Danny1234' }, headers: { 'quck-credit-access-token': clientToken } }, (err, res, body) => {
          if (!err) {
            expect(body.status).to.equal(400);
          }
        });
        done();
      });
    });
  });
});
