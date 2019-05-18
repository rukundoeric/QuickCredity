import pool from './connect/connection';

class QueryExecutor {
  constructor() {
    this.queryParams = (text, params) => new Promise((resolve, reject) => {
      pool.query(text, params).then((res) => {
        resolve(res);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new QueryExecutor();
