const path = require('path')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// middlewares
const logger = require('./middlewares/logger')

const { API_PORT, NODE_ENV } = process.env

const loggerOutputDest = process.stdout

// Create an app instance & bind routers/ routes / middlewares etc.
const app = express()

app.use(logger)
app.get('/', (req, res) => {
  res.status(200).send(`server is running...`)
})

app.listen(API_PORT, () => {
  console.log(`server is listening on the PORT ${API_PORT}.`)
})
