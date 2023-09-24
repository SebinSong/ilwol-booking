const path = require('path')
const logger = require('morgan')
const rfs = require('rotating-file-stream')

const isProd = process.env.NODE_ENV === 'production'

const loggerDest = isProd
  // reference: https://www.npmjs.com/package/morgan#log-file-rotation
  ? rfs.createStream('appLog.log', { interval: '1M', path: path.resolve(__dirname, '../log') })
  : process.stdout

module.exports = logger(
  isProd ? 'common' : 'dev', 
  { stream: loggerDest }
)
