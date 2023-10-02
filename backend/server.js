const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./db.js')

// importing .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

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
app.use(cookieParser())

// attaching routes
app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
  res.status(200).send(`server is running...`)
})

// error handlers
app.use(notFound)
app.use(globalErrorHandler)

connectDB((err) => {
  if (err) {
    console.error('error ocurred while connecting to DB: '.underline.bold.red, err)
    process.exit(1)
  }

  console.log('\n\n- successfully connected to DB..!'.brightYellow.underline)
  app.listen(API_PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${API_PORT}.`.bold.yellow.underline)
  })
})
