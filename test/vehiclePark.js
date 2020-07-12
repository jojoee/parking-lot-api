require('dotenv').config({ path: '.env.test' })
const assert = require('assert')
const constant = require('../config/constant')
const supertest = require('supertest')
const model = require('./../model')
const testHelper = require('./testHelper')
let request, server, db, response
let vehicleSizeId, plateNumber, parkingLot

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
  db = model.getConnections()
})

describe('POST /vehicle/park to get a ticket', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare
    vehicleSizeId = constant.VEHICLE_SIZE.MEDIUM
    plateNumber = 'abc-123'

    // prepare, create parking lot
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: {
          1: 1,
          2: 3,
          3: 3
        }
      })
    parkingLot = response.body.data

    // perform
    response = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: parkingLot.id
      })
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.CREATED}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.CREATED)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.CREATED)
    assert.notStrictEqual(response.body.data, null)
    assert.strictEqual(response.body.message, '')
  })

  it('updates parkingLotStack record', async () => {
    const { dataValues: parkingLotStack } = await db.ParkingLotStack.findOne({ where: {
      parking_lot_id: parkingLot.id,
      slot_size_id: vehicleSizeId
    } })
    assert.strictEqual(JSON.parse(parkingLotStack.data).length, 2)
  })

  it(`updates slot record to ${constant.SLOT_STATUS.OCCUPIED}`, async () => {
    const { dataValues: slot } = await db.Slot.findOne({ where: {
      id: response.body.data.slot_id
    } })
    assert.strictEqual(slot.slot_status_id, constant.SLOT_STATUS.OCCUPIED)
  })

  it('creates ticket record', async () => {
    const { dataValues: ticket } = await db.Ticket.findOne({ where: {
      id: response.body.data.id
    } })
    assert.strictEqual(ticket.plate_number, plateNumber)
    assert.strictEqual(ticket.slot_id, response.body.data.slot_id)
    assert.strictEqual(ticket.ticket_status_id, constant.TICKET_STATUS.OPEN)
    assert.strictEqual(ticket.vehicle_size_id, vehicleSizeId)
  })
})

describe('POST /vehicle/park to get a nearest slot', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare
    vehicleSizeId = constant.VEHICLE_SIZE.MEDIUM
    plateNumber = 'abc-123'

    // prepare, create parking lots
    await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: { 1: 0, 2: 2, 3: 0 }
      })
    const currentParkingLotResponse = await request
      .post('/parking_lot')
      .send({
        name: 'mall_4',
        rank: 4,
        nSlotsKey: { 1: 1, 2: 0, 3: 0 }
      })
    await request
      .post('/parking_lot')
      .send({
        name: 'mall_5',
        rank: 5,
        nSlotsKey: { 1: 0, 2: 3, 3: 0 }
      })

    // perform
    response = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotResponse.body.data.id
      })
  })

  it(`returns ${constant.HTTP_CODE.CREATED}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.CREATED)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.CREATED)
    assert.notStrictEqual(response.body.data, null)
    assert.strictEqual(response.body.message, '')
  })

  // todo move constant/hardcode to test/fixture
  it('returns lowest rank slot in nearest parking lot rank', async () => {
    // check lowest rank slot
    const { dataValues: slot } = await db.Slot.findOne({ where: {
      id: response.body.data.slot_id,
      slot_size_id: vehicleSizeId
    } })
    assert.strictEqual(slot.rank, 1)

    // check nearest parking lot
    const { dataValues: parkingLot } = await db.ParkingLot.findOne({ where: {
      id: slot.parking_lot_id
    } })
    assert.strictEqual(parkingLot.rank, 5)
  })
})

describe(`POST /vehicle/park to get a nearest slot
  (1st nearest parking slot is not available, using 2nd nearest parking slot`, () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare, reset
    vehicleSizeId = constant.VEHICLE_SIZE.MEDIUM
    plateNumber = 'abc-123'

    // prepare, create parking lots
    await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: { 1: 0, 2: 3, 3: 0 }
      })
    const currentParkingLotResponse = await request
      .post('/parking_lot')
      .send({
        name: 'mall_4',
        rank: 4,
        nSlotsKey: { 1: 1, 2: 0, 3: 0 }
      })
    await request
      .post('/parking_lot')
      .send({
        name: 'mall_5',
        rank: 5,
        nSlotsKey: { 1: 0, 2: 2, 3: 0 }
      })

    // perform
    const currentParkingLotId = currentParkingLotResponse.body.data.id
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
    response = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
  })

  it(`returns ${constant.HTTP_CODE.CREATED}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.CREATED)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.CREATED)
    assert.notStrictEqual(response.body.data, null)
    assert.strictEqual(response.body.message, '')
  })

  // todo move constant/hardcode to test/fixture
  it('returns lowest rank slot in nearest parking lot rank', async () => {
    // check lowest rank slot
    const { dataValues: slot } = await db.Slot.findOne({ where: {
      id: response.body.data.slot_id,
      slot_size_id: vehicleSizeId
    } })
    assert.strictEqual(slot.rank, 2)

    // check nearest parking lot
    const { dataValues: parkingLot } = await db.ParkingLot.findOne({ where: {
      id: slot.parking_lot_id
    } })
    assert.strictEqual(parkingLot.rank, 1)
  })
})

describe('POST /vehicle/park to get a nearest slot but not slot available', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare
    vehicleSizeId = constant.VEHICLE_SIZE.MEDIUM
    plateNumber = 'abc-123'

    // prepare, create parking lots
    await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: { 1: 2, 2: 0, 3: 0 }
      })
    const currentParkingLotResponse = await request
      .post('/parking_lot')
      .send({
        name: 'mall_4',
        rank: 4,
        nSlotsKey: { 1: 1, 2: 1, 3: 0 }
      })

    // perform
    const currentParkingLotId = currentParkingLotResponse.body.data.id
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
    response = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: currentParkingLotId
      })
  })

  it(`returns ${constant.HTTP_CODE.OK}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.data, null)
    assert.strictEqual(response.body.message, '')
  })
})

describe('POST /vehicle/park to get a nearest slot with invalid parameter', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // perform
    response = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId: 'id one',
        plateNumber: 1548793,
        parkingLotId: 'one-five-seven'
      })
  })

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
            value: 'id one',
            key: 'vehicleSizeId',
            label: 'vehicleSizeId'
          }
        },
        {
          message: '"plateNumber" must be a string',
          path: [
            'plateNumber'
          ],
          type: 'string.base',
          context: {
            value: 1548793,
            key: 'plateNumber',
            label: 'plateNumber'
          }
        },
        {
          message: '"parkingLotId" must be a number',
          path: [
            'parkingLotId'
          ],
          type: 'number.base',
          context: {
            value: 'one-five-seven',
            key: 'parkingLotId',
            label: 'parkingLotId'
          }
        }
      ],
      message: ''
    })
  })
})
