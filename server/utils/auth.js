/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/UserModel';
import ST from './status';
import MSG from './res_messages';

class Auth {
  constructor() {
    dotenv.config();
  }

  async verifyToken(req, res, next) {
    const token = req.headers['quck-credit-access-token'];
    if (!token) {
      return res.status(ST.BAD_REQUEST).send({
        status: ST.BAD_REQUEST,
        error: 'Token is not provided',
      });
    }
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      User.getUserById(decoded.userid).then((user) => {
        if (user == null) {
          res.status(ST.BAD_REQUEST).send(MSG.MSG_INVALID_TOKEN);
        }
        req.user = { id: decoded.userid };
        next();
      });
    } catch (error) {
      return res.status(ST.BAD_REQUEST).send({
        status: ST.BAD_REQUEST,
        error: error.message,
      });
    }
  }

  async generateToken(user) {
    const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  }

  async getIdfromToken(token) {
    const UserId = await jwt.verify(token, process.env.JWT_SECRET).userid;
    return UserId;
  }
}
export default new Auth();
