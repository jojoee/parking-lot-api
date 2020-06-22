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
      console.log(err)
      reply(res, { code: constant.HTTP_CODE.BAD_REQUEST })
    }
  }
}

module.exports = {
  park
}
