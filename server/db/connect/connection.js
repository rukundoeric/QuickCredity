/* eslint-disable linebreak-style */
import pg from 'pg';
import dotenv from 'dotenv';
import con from './con_file';

dotenv.config();
const config = con.getConnectionConfig;
class Connector {
  constructor() {
    this.getPoolConnection = () => new pg.Pool(config);
  }
}
export default new Connector();
