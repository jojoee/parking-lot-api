require('dotenv').config()
const packageJsonConfig = require('./../package.json')

module.exports = {
  NAME: packageJsonConfig.name,
  VERSION: packageJsonConfig.version,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SECRET: process.env.SECRET || 'meow'
}
