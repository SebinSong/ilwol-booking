const path = require('path')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
const { API_PORT } = process.env
const app = express()

app.get('/', (req, res) => {
  res.status(200).send(`server is running...`)
})

app.listen(API_PORT, () => {
  console.log(`server is listening on the PORT ${API_PORT}.`)
})
