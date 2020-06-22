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

describe('GET /parking_lot/status to get parking lot status', () => {
  before(async () => {
    // prepare
    await model.resetTable('Ticket')
    await model.resetTable('Slot')
    await model.resetTable('ParkingLotStack')
    await model.resetTable('ParkingLot')

    // prepare, add parking lot
    await request.post('/parking_lot').send({
      name: 'mall_1',
      rank: 1,
      nSlotsKey: { 1: 1, 2: 2, 3: 3 }
    })
    await request.post('/parking_lot').send({
      name: 'mall_2',
      rank: 2,
      nSlotsKey: { 1: 0, 2: 2, 3: 0 }
    })

    // perform
    response = await request.get('/parking_lot/status')
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.OK}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.message, '')
    assert.strictEqual(response.body.data.length, 6)
  })
})
