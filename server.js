require('dotenv').config()
const config = require('./config')
const debug = require('debug')(`${config.NAME}:server`)
const server = require('./app')

server.listen(config.PORT, () => {
  debug(`listening at http://localhost:${config.PORT}`)
})
