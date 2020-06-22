const config = require('../config')
const debug = require('debug')(`${config.NAME}:service:ticket`)
const db = require('../model').getConnections()

async function getTickets ({ vehicleSizeId }) {
  debug(getTickets.name)
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
