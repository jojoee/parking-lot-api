const config = require('../config')
const constant = require('../config/constant')
const debug = require('debug')(`${config.NAME}:service:parkingLot`)
const db = require('../model').getConnections()

/**
 * @param {String} name
 * @param {Number} rank integer number
 * @param {Object} nSlotsKey
 * @returns {ParkingLot}
 */
async function createParkingLot ({ name, rank, nSlotsKey }) {
  debug(createParkingLot.name)

  // create parkingLot
  const { dataValues: parkingLot } = await db.ParkingLot.create({ name, rank })

  // get all current slotSize
  const result = await db.SlotSize.findAll({})
  const slotSizeIds = result.map(item => item.dataValues.id)

  for (const slotSizeId of slotSizeIds) {
    const nSlots = nSlotsKey[slotSizeId]
    const ranks = Array(nSlots).fill(null).map((_, i) => i + 1)

    // create slots for each size
    const slots = ranks.map(rank => {
      return {
        rank,
        parking_lot_id: parkingLot.id,
        slot_size_id: slotSizeId,
        slot_status_id: constant.SLOT_STATUS.UNOCCUPIED
      }
    })
    const models = await db.Slot.bulkCreate(slots, { returning: true }) // Sequelize.Model
    const slotIds = models.map(item => item.dataValues.id)

    // create parkingSlotStack for caching
    const parkingLotStack = {
      parking_lot_rank: parkingLot.rank,
      parking_lot_id: parkingLot.id,
      slot_size_id: slotSizeId,
      data: JSON.stringify(slotIds)
    }
    await db.ParkingLotStack.create(parkingLotStack)
  }

  return parkingLot
}

module.exports = {
  createParkingLot
}
