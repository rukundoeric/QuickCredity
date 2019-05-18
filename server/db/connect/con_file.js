/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
// Update with your config settings.

// Update with your config settings.
// const config = {
//   user: 'DannyAdmin',
//   database: 'quick-credit',
//   password: 'DannyPro123',
//   port: 5432,
// };
import dotenv from 'dotenv';

dotenv.config();
class ConnectionConfig {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.development = {
      host: '127.0.0.1',
      user: 'DannyAdmin',
      password: 'DannyPro123',
      database: 'quick-credit',
    };
    this.test = {
      connectionString: process.env.TEST_DATABASE_URL,
    };
    this.production = {
      connectionString: process.env.DATABASE_URL,
    };
    this.getConnectionConfig = () => (this.environment == 'development' ? this.development : this.environment == 'test' ?  this.test : this.production);
  }
}
export default new ConnectionConfig();
