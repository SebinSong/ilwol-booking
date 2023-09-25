const path = require('path')
const dotenv = require('dotenv')
const express = require('express')

// importing .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// routers
const authRouter = require('./routes/authRoutes')

// middlewares
const logger = require('./middlewares/logger')
const {
  globalErrorHandler,
  notFound
} = require('./middlewares/errorMiddlewares')

// local variables
const { API_PORT, NODE_ENV } = process.env
const loggerOutputDest = process.stdout

// Create an app instance & bind routers/ routes / middlewares etc.
const app = express()

// global middlewares
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// attaching routes
app.use('/auth', authRouter)
app.get('/', (req, res) => {
  res.status(200).send(`server is running...`)
})

// error handlers
app.use(notFound)
app.use(globalErrorHandler)

app.listen(API_PORT, () => {
  console.log(`server is listening on the PORT ${API_PORT}.`)
})
