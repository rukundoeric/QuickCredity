/* eslint-disable linebreak-style */
// Update with your config settings.
import dotenv from 'dotenv';

dotenv.config();
class ConnectionConfig {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.development = {
      user: 'DannyAdmin',
      database: 'quick-credit',
      password: 'DannyPro123',
      port: 5432,
    };
    this.production = {
      connection: process.env.DATABASE_URL,
    };
    this.getConnectionConfig = () => (this.environment === 'development' ? this.development : this.production);
  }
}
export default new ConnectionConfig();
