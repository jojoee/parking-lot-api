const config = require('./config')
const model = require('./model')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const app = express()
const router = require('./route')

// init
// todo make sure database connection is already established before start the app
// todo gracefully restart ?
model.initDb()

// middleware
app.use(cors()) // considering removing it if you dont need it
app.use(helmet())
app.use(compression())
app.use(session({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)

module.exports = app
