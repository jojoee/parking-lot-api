const { reply } = require('./../module/util')
const config = require('../config')
const parkingLotService = require('../service/parkingLotService')
const constant = require('../config/constant')
const debug = require('debug')(`${config.NAME}:controller:parkingLot`)

async function createParkingLot (req, res, next) {
  debug(createParkingLot.name)
  const {
    name,
    rank,
    nSlotsKey
  } = req.body

  try {
    const parkingLot = await parkingLotService.createParkingLot({ name, rank, nSlotsKey })

    reply(res, {
      code: constant.HTTP_CODE.CREATED,
      data: parkingLot
    })
  } catch (err) {
    reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
  }
}

module.exports = {
  createParkingLot
}
