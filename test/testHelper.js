const model = require('./../model')

async function resetTestTables () {
  await model.resetTable('Ticket')
  await model.resetTable('Slot')
  await model.resetTable('ParkingLotStack')
  await model.resetTable('ParkingLot')
}

async function sleep (waitTimeInMs) {
  return new Promise(resolve => setTimeout(resolve, waitTimeInMs))
}

module.exports = {
  resetTestTables,
  sleep
}
