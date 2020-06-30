const model = require('./../model')

async function resetTestTables () {
  await model.resetTable('Ticket')
  await model.resetTable('Slot')
  await model.resetTable('ParkingLotStack')
  await model.resetTable('ParkingLot')
}

module.exports = {
  resetTestTables
}
