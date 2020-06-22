const { reply } = require('./../module/util')
const config = require('../config')
const constant = require('../config/constant')
const parkingLotService = require('../service/parkingLotService')
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
    console.log('err', err)
    reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
  }
}

async function getParkingLotStacks (req, res, next) {
  debug(getParkingLotStacks.name)

  try {
    const parkingLotStacks = await parkingLotService.getParkingLotStacks()

    reply(res, {
      data: parkingLotStacks
    })
  } catch (err) {
    console.log('err', err)
    reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
  }
}

module.exports = {
  createParkingLot,
  getParkingLotStacks
}
