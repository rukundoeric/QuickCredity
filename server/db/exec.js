import pg from 'pg';
import ConnectionConfig from './connect/con_file';
import queryString from './query';

const config = {
  user: 'DannyAdmin',
  database: 'quick-credit',
  password: 'DannyPro123',
  port: 5432,
};
const pool = new pg.Pool(config);
class QueryExecutor {
  constructor() {
    this.queryParams = (string, params) => new Promise((resolve, reject) => {
      pool.connect((err, client, done) => {
        if (err) {
          reject(err);
        }
        client.query(string, params).then(({ rows }) => {
          resolve(rows);
        }).catch((error) => {
          reject(error);
        });
        done();
      });
    });
    this.QueryNoParams = string => new Promise((resolve, reject) => {
      pool.connect((err, client, done) => {
        client.query(string).then(({ rows }) => {
          resolve(rows);
        }).catch((error) => {
          reject(error);
        });
        done();
      });
    });
  }
}
export default new QueryExecutor();
