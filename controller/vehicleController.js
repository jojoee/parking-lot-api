const { reply } = require('../module/util')
const config = require('../config')
const constant = require('../config/constant')
const vehicleService = require('../service/vehicleService')
const debug = require('debug')(`${config.NAME}:controller:vehicle`)

async function park (req, res, next) {
  debug(park.name)
  const {
    vehicleSizeId,
    plateNumber,
    parkingLotId // entry parking lot id
  } = req.body

  try {
    const ticket = await vehicleService.park({
      vehicleSizeId,
      plateNumber,
      parkingLotId
    })

    reply(res, {
      code: constant.HTTP_CODE.CREATED,
      data: ticket
    })
  } catch (err) {
    if (err.message === 'no available slot') {
      reply(res, {
        data: null
      })
    } else {
      console.log('err', err)
      reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
    }
  }
}

async function exit (req, res, next) {
  debug(exit.name)
  const {
    ticketId
  } = req.body

  try {
    await vehicleService.exit({ ticketId })

    reply(res, { code: constant.HTTP_CODE.OK })
  } catch (err) {
    if (err.message === 'not found ticket id') {
      reply(res, {
        code: constant.HTTP_CODE.NOT_FOUND
      })
    } else {
      console.log('err', err)
      reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
    }
  }
}

module.exports = {
  park,
  exit
}
