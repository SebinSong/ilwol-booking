const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

// importing .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

const { DB_URI, DB_URI_PROD = '', DB_NAME } = process.env

exports.connectDB = async (cb, useProd = false) => {
  const uriToUse = useProd ? DB_URI_PROD || DB_URI : DB_URI
  try {
    const { connection } = await mongoose.connect(uriToUse, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      dbName: DB_NAME
    })

    // register event handlers for DB connection.
    connection.on('disconnected', err => {
      console.error('::: DB disconnected: ', err)
      process.exit(1)
    })

    connection.on('error', err => {
      console.error('::: DB operation error: ', err)
      process.exit(1)
    })

    cb & cb()
  } catch (err) {
    // catches the error from initial connection
    console.error('::: DB startup error: ', err)
    cb && cb(err)
  }
}
