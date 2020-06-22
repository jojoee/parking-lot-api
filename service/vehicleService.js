const config = require('../config')
const constant = require('../config/constant')
const { Op } = require('sequelize')
const debug = require('debug')(`${config.NAME}:service:vehicle`)
const db = require('../model').getConnections()
const util = require('../module/util')

/**
 * @returns {Ticket}
 */
async function park ({
  vehicleSizeId = 0,
  plateNumber = '',
  parkingLotId = 0
}) {
  debug(park.name)

  // find all stacks by slot_size_id
  const parkingLotStackModels = await db.ParkingLotStack.findAll({
    where: {
      slot_size_id: vehicleSizeId, // todo refactor this size id, now it the same
      data: { [Op.not]: '[]' }
    },
    order: [['parking_lot_rank', 'asc']]
  })
  const parkingLotStacks = parkingLotStackModels.map(item => item.dataValues)

  // find available slot
  const availableParkingLotStack = util.getNearestAvailableParkingLotStack(parkingLotId, parkingLotStacks)
  if (availableParkingLotStack === null) {
    throw new Error('no available slot')
  }

  // if there has slot available
  let transaction
  try {
    // get transaction
    transaction = await db.sequelize.transaction()

    // get the nearest slot id
    const slotIds = JSON.parse(availableParkingLotStack.data)
    const nearestSlotId = slotIds.shift()

    // update stack (caching)
    await db.ParkingLotStack.update({
      data: JSON.stringify(slotIds) // remaining slot ids
    }, {
      where: { id: availableParkingLotStack.id },
      transaction
    })

    // update slot status
    await db.Slot.update({
      slot_status_id: constant.SLOT_STATUS.OCCUPIED
    }, {
      where: { id: nearestSlotId },
      transaction
    })

    // create ticket
    const ticketModel = await db.Ticket.create({
      plate_number: plateNumber,
      vehicle_size_id: vehicleSizeId,
      slot_id: nearestSlotId,
      ticket_status_id: constant.TICKET_STATUS.OPEN
    }, {
      transaction
    })

    // commit
    await transaction.commit()

    return ticketModel.dataValues
  } catch (err) {
    // Rollback transaction only if the transaction object is defined
    if (transaction) await transaction.rollback()
  }
}

module.exports = {
  park
}
