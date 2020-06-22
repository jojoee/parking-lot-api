require('dotenv').config({ path: '.env.test' })
const assert = require('assert')
const constant = require('../config/constant')
const supertest = require('supertest')
const model = require('./../model')
let request, server, response

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
})

describe('GET /ticket to get a ticket', () => {
  before(async () => {
    // prepare, create parking lot
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: {
          1: 2,
          2: 2,
          3: 2
        }
      })
    const parkingLot = response.body.data

    // prepare, park a vehicle
    await request.post('/vehicle/park').send({
      vehicleSizeId: constant.VEHICLE_SIZE.SMALL,
      plateNumber: 'small-1',
      parkingLotId: parkingLot.id
    })
    await request.post('/vehicle/park').send({
      vehicleSizeId: constant.VEHICLE_SIZE.MEDIUM,
      plateNumber: 'medium-1',
      parkingLotId: parkingLot.id
    })
    await request.post('/vehicle/park').send({
      vehicleSizeId: constant.VEHICLE_SIZE.SMALL,
      plateNumber: 'small-2',
      parkingLotId: parkingLot.id
    })

    // perform
    response = await request
      .get(`/ticket?vehicleSizeId=${constant.SLOT_SIZE.SMALL}`)
  })

  after(async () => {
    await model.resetTable('Ticket')
    await model.resetTable('Slot')
    await model.resetTable('ParkingLotStack')
    await model.resetTable('ParkingLot')
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.OK}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.data.length, 2)
    assert.strictEqual(response.body.message, '')
  })
})
