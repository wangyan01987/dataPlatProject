'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  Base_URL:'"http://easybom.parallel-cloud.com:6041/"',
  //Base_URL:'"https://192.168.0.103:6689/api/"',
});
