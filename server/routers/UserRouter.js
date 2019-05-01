import express from 'express';
import user from '../controlers/User';
import auth from '../utils/auth';


const router = express.Router();
// ROuters for models(V1)
router.get('/api/v1/users', auth.verifyToken, user.getAllUser);
router.post('/api/v1/auth/signup', user.signUp);
router.post('/api/v1/auth/login', user.login);

export default router;
