const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const colors = require('colors')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const APP_CLIENT_PATH = path.resolve(__dirname, '../dist')

// importing .env file
dotenv.config({ path: path.resolve(__dirname, '.env') })

// routers
const authRouter = require('./routes/authRoutes')
const inquiryRouter = require('./routes/inquiryRoutes')
const reservationRouter = require('./routes/reservationRoutes')
const manageRouter = require('./routes/manageRoutes')
const configRouter = require('./routes/configRoutes')
const usersRouter = require('./routes/usersRoutes.js')
const contactsRouter = require('./routes/contactsRoutes.js')

// middlewares
const logger = require('./middlewares/logger')
const {
  globalErrorHandler,
  notFound
} = require('./middlewares/errorMiddlewares')

// local variables
const { API_PORT, NODE_ENV } = process.env

// Create an app instance & bind routers/ routes / middlewares etc.
const app = express()

// global middlewares
app.use(logger)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// attaching routes
app.use('/api/auth', authRouter)
app.use('/api/inquiry', inquiryRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/manage', manageRouter)
app.use('/api/config', configRouter)
app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

// static server setup
app.use(express.static(APP_CLIENT_PATH))
app.get('*', (req, res) => {
  // any route that is not api will be redirected to index.html
  res.sendFile(path.join(APP_CLIENT_PATH, 'index.html'))
})

// error handlers
app.use(notFound)
app.use(globalErrorHandler)

module.exports = app