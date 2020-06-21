const config = require('../config')
const debug = require('debug')(`${config.NAME}:model`)
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const db = {}
const destroyOpt = {
  where: {},
  truncate: { cascade: true }
}
let sequelize

/**
 * Initialize database
 * only used once on main file
 */
function initDb () {
  debug(initDb.name)
  sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USERNAME,
    config.DB_PASSWORD, {
      host: config.DB_HOST,
      dialect: 'mysql',
      logging: false,
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    }
  )

  fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && (!file.includes('spec')))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize
}

function getConnections () {
  debug(getConnections.name)
  return db
}

async function resetAllTables () {
  await Object.keys(db).forEach((id, i) => {
    if (id.toLowerCase() !== 'sequelize') {
      db[id].destroy(destroyOpt)
    }
  })
}

/**
 * @param {string} modelName e.g. User
 */
async function resetTable (modelName) {
  await db[modelName].destroy(destroyOpt)
}

module.exports = {
  initDb,
  getConnections,
  resetAllTables,
  resetTable
}
