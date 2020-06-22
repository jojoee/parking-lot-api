const config = require('../config')
const debug = require('debug')(`${config.NAME}:service:ticket`)
const db = require('../model').getConnections()

/**
 * @param {Number} param.vehicleSizeId
 * @returns {Ticket[]}
 */
async function getTickets (param) {
  debug(getTickets.name)
  const { vehicleSizeId } = param
  const ticketModels = await db.Ticket.findAll({
    where: {
      vehicle_size_id: vehicleSizeId
    }
  })
  const tickets = (ticketModels.length > 0)
    ? ticketModels.map(item => item.dataValues)
    : []

  return tickets
}

module.exports = {
  getTickets
}
