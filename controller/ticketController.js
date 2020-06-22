const { reply } = require('../module/util')
const config = require('../config')
const constant = require('../config/constant')
const ticketService = require('../service/ticketService')
const debug = require('debug')(`${config.NAME}:controller:ticket`)

async function getTickets (req, res, next) {
  debug(getTickets.name)
  const vehicleSizeId = parseInt(req.query.vehicleSizeId)

  try {
    const tickets = await ticketService.getTickets({ vehicleSizeId })

    reply(res, {
      data: tickets
    })
  } catch (err) {
    reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
  }
}

module.exports = {
  getTickets
}
