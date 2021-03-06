require('dotenv').config({ path: '.env.test' })
const assert = require('assert')
const constant = require('../config/constant')
const supertest = require('supertest')
const testHelper = require('./testHelper')
let request, server, response

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
})

describe('GET /ticket to get a ticket', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

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

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.OK}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.data.length, 2)
    assert.strictEqual(response.body.message, '')
  })
})

describe('GET /ticket to get a ticket with invalid parameter', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // perform
    response = await request
      .get('/ticket?vehicleSizeId=two')
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.UNPROCESSABLE_ENTITY}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.UNPROCESSABLE_ENTITY)
    assert.deepStrictEqual(response.body, {
      code: 422,
      data: [
        {
          message: '"vehicleSizeId" must be a number',
          path: [
            'vehicleSizeId'
          ],
          type: 'number.base',
          context: {
            value: 'two',
            key: 'vehicleSizeId',
            label: 'vehicleSizeId'
          }
        }
      ],
      message: ''
    })
  })
})
