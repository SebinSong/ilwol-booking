const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./db.js')
const APP_CLIENT_PATH = path.resolve(__dirname, '../dist')


// importing .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

// routers
const authRouter = require('./routes/authRoutes')
const inquiryRouter = require('./routes/inquiryRoutes')
const reservationRouter = require('./routes/reservationRoutes')
const manageRouter = require('./routes/manageRoutes')
const configRouter = require('./routes/configRoutes')

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
app.use('/api/inquiry', inquiryRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/manage', manageRouter)
app.use('/api/config', configRouter)

// static server setup
app.use(express.static(APP_CLIENT_PATH))
app.get('*', (req, res) => {
  // any route that is not api will be redirected to index.html
  res.sendFile(path.join(APP_CLIENT_PATH, 'index.html'))
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
