const path = require('path')
const os = require('os')
const cluster = require('cluster')

const dotenv = require('dotenv')
const colors = require('colors')

const app = require('./app.js')
const { connectDB } = require('./db.js')

// importing .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

// local variables
const { API_PORT, NODE_ENV } = process.env

if (cluster.isMaster) {
  const NUM_WORKERS = 4

  console.log(`[Master] Spawning ${NUM_WORKERS} child-processes...`.bold.brightGreen)
  for (let i=0; i<NUM_WORKERS; i++) {
    cluster.fork()
  }
} else {
  connectDB((err) => {
    if (err) {
      console.error(`[${process.pid}] error ocurred while connecting to DB: `.underline.bold.red, err)
      process.exit(1)
    }
  
    console.log(`\n\n- [${process.pid}] successfully connected to DB..!`.brightYellow.underline)
    app.listen(API_PORT, () => {
      console.log(`[${process.pid}] Server running in ${NODE_ENV} mode on port ${API_PORT}.`.bold.yellow.underline)
    })
  })
}