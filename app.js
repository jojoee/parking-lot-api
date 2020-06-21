const config = require('./config')
const model = require('./model')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const app = express()
const router = require('./route')

// init
model.initDb()

// middleware
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
