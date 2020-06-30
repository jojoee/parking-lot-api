const config = require('../config')
const constant = require('../config/constant')
const { Op } = require('sequelize')
const debug = require('debug')(`${config.NAME}:service:vehicle`)
const db = require('../model').getConnections()
const util = require('../module/util')

/**
 * @param {Number} [param.vehicleSizeId=0]
 * @param {String} [param.plateNumber='']
 * @param {Number} [param.parkingLotId=0]
 * @returns {Ticket}
 */
async function park (param) {
  debug(park.name)
  const {
    vehicleSizeId = 0,
    plateNumber = '',
    parkingLotId = 0
  } = param

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

/**
 * @param {Number} param.ticketId
 */
async function exit (param) {
  debug(exit.name)
  const { ticketId } = param

  const ticketModel = await db.Ticket.findOne({
    where: { id: ticketId }
  })
  // todo returns 404 instead
  if (!ticketModel) throw new Error('not found ticket id')
  const ticket = ticketModel.dataValues

  // if there has slot available
  let transaction
  try {
    // get transaction
    transaction = await db.sequelize.transaction()

    // change the ticket
    await db.Ticket.update({
      ticket_status_id: constant.TICKET_STATUS.CLOSE,
      exit_at: db.sequelize.literal('CURRENT_TIMESTAMP')
    }, {
      where: { id: ticket.id },
      transaction
    })

    // update slot status
    await db.Slot.update({
      slot_status_id: constant.SLOT_STATUS.UNOCCUPIED
    }, {
      where: { id: ticket.slot_id },
      transaction
    })

    // update parkingLotStack, current data
    const { dataValues: slot } = await db.Slot.findOne({
      where: { id: ticket.slot_id },
      transaction
    })
    const { dataValues: parkingLotStack } = await db.ParkingLotStack.findOne({
      where: {
        parking_lot_id: slot.parking_lot_id,
        slot_size_id: slot.slot_size_id
      },
      transaction
    })
    // update parkingLotStack, update caching available slot ids
    // we can sort slot rank by its id
    const availableSlotIds = JSON.parse(parkingLotStack.data)
    availableSlotIds.push(slot.id)
    const sortedAvailableSlotIds = availableSlotIds.sort((a, b) => a - b) // asc (min => max)
    await db.ParkingLotStack.update({
      data: JSON.stringify(sortedAvailableSlotIds)
    }, {
      where: {
        id: parkingLotStack.id
      },
      transaction
    })

    // commit
    await transaction.commit()
  } catch (err) {
    // Rollback transaction only if the transaction object is defined
    if (transaction) await transaction.rollback()
  }
}

module.exports = {
  park,
  exit
}
