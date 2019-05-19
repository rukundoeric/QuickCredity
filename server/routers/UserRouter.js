/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import express from 'express';
import user from '../controlers/User';
import auth from '../utils/auth';
import Auth from '../db/middleware/auth';
import UserC from '../db/controllers/UserController';


const router = express.Router();
// ROuters for models(V1)
router.get('/api/v1/users', auth.verifyToken, user.getAllUser);
router.post('/api/v1/auth/signup', user.signUp);
router.post('/api/v1/auth/login', user.login);
router.post('/api/v1/users/reset', auth.verifyToken, user.resetPassword);
router.patch('/api/v1/users/verify/:email', auth.verifyToken, user.verfyUser);
router.post('/api/v2/auth/signup', UserC.signUp);
router.post('/api/v2/auth/login', UserC.login);

router.patch('/api/v2/users/verify/:email', Auth.verifyToken, UserC.verify);
router.post('/api/v2/users/reset/:email', Auth.verifyToken, UserC.resetPassword);
router.get('/api/v2/users', Auth.verifyToken, UserC.getUsers);
export default router;
