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

    // this.queryParams = (string, params) => new Promise((resolve, reject) => {
    //   pool.connect((err, client, done) => {
    //     if (err) {
    //       reject(err);
    //     }
    //     client.query(string, params).then(({ rows }) => {
    //       resolve(rows);
    //     }).catch((error) => {
    //       reject(error);
    //     });
    //     done();
    //   });
    // });
    // this.QueryNoParams = string => new Promise((resolve, reject) => {
    //   pool.connect((err, client, done) => {
    //     client.query(string).then(({ rows }) => {
    //       resolve(rows);
    //     }).catch((error) => {
    //       reject(error);
    //     });
    //     done();
    //   });
    // });
  }
}
export default new QueryExecutor();
