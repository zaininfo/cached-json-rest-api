require('babel-register')
require('babel-polyfill')

const path = require('path')

process.on('unhandledRejection', function (reason) {
  process.emit('SIGTERM')
  throw reason
})

if (!process.env.NODE_CONFIG_DIR) {
  process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config')
}

require('./app')
