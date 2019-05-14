require('babel-register')({
  presets: ['env'],
});
require('babel-core/register');
require('babel-polyfill');
module.exports = require('./server.js');
