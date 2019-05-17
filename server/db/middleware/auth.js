/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import queryString from '../query';
import ST from '../../utils/status';
import db from '../create/db';

class Auth {
  constructor() {
    dotenv.config();
  }

  // eslint-disable-next-line consistent-return
  async verifyToken(req, res, next) {
    try {
      const token = req.headers['quck-credit-access-token'];
      if (!token) {
        return res.status(ST.BAD_REQUEST).send({
          status: ST.BAD_REQUEST,
          error: 'Token is not provided',
        });
      }
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      db.query(queryString.getUserById, [decoded.userid]).then((result) => {
        if (!result.rows[0]) {
          return res.status(ST.BAD_REQUEST).send({
            status: ST.BAD_REQUEST,
            error: { message: 'The token you provided is invalid' },
          });
        }
        req.user = { id: result.rows[0].id };
        next();
      });
    } catch (error) {
      return res.status(ST.BAD_REQUEST).send({
        status: ST.BAD_REQUEST,
        error: { message: 'The token you provided is invalid' },
      });
    }
  }

  async generateToken(user) {
    const payload = { user: user.firstName };
    const options = { expiresIn: '20d' };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, options);
    return token;
  }

  async getIdfromToken(token) {
    const UserId = await jwt.verify(token, process.env.JWT_SECRET).userid;
    return UserId;
  }
}
export default new Auth();
