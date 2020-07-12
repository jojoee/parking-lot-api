require('dotenv').config({ path: '.env.test' })
const assert = require('assert')
const constant = require('../config/constant')
const supertest = require('supertest')
const model = require('./../model')
const testHelper = require('./testHelper')
let request, server, db, response
let parkingLot, vehicleSizeId, plateNumber, ticket

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
  db = model.getConnections()
})

describe('POST /vehicle/exit to leave the parking lot', () => {
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
        nSlotsKey: { 1: 0, 2: 4, 3: 0 }
      })
    parkingLot = response.body.data

    // prepare, park 3 vehicles
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: parkingLot.id
      })
    const ticketResponse = await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: parkingLot.id
      })
    await request
      .post('/vehicle/park')
      .send({
        vehicleSizeId,
        plateNumber,
        parkingLotId: parkingLot.id
      })
    ticket = ticketResponse.body.data

    // perform
    await testHelper.sleep(1010)
    response = await request
      .post('/vehicle/exit')
      .send({
        ticketId: ticket.id
      })
  })

  it(`returns ${constant.HTTP_CODE.OK}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.OK)
    assert.strictEqual(response.body.data, null)
    assert.strictEqual(response.body.message, '')
  })

  it('updates ticket row', async () => {
    const ticketModel = await db.Ticket.findOne({ where: {
      id: ticket.id
    } })

    // update status
    assert.strictEqual(ticketModel.dataValues.ticket_status_id, constant.TICKET_STATUS.CLOSE)

    // update "exit_at"
    const exitAt = new Date(ticketModel.dataValues.exit_at)
    const parkAt = new Date(ticketModel.dataValues.park_at)
    const diff = exitAt.getTime() - parkAt.getTime()
    assert.ok(diff > 0)
  })

  it('updates slot status', async () => {
    const slotModel = await db.Slot.findOne({ where: {
      id: ticket.slot_id
    } })
    assert.strictEqual(slotModel.dataValues.slot_status_id, constant.SLOT_STATUS.UNOCCUPIED)
  })

  it('updates parkingLotStack data', async () => {
    const parkingLotStackModel = await db.ParkingLotStack.findOne({
      where: {
        parking_lot_id: parkingLot.id,
        slot_size_id: ticket.vehicle_size_id
      }
    })
    const availableSlotIds = JSON.parse(parkingLotStackModel.dataValues.data)

    // number of slot ids is correct
    assert.strictEqual(availableSlotIds.length, 2)
    // slot ids are sorted
    assert.deepStrictEqual(availableSlotIds, availableSlotIds.sort((a, b) => a - b))
  })
})

describe('POST /vehicle/exit not found a ticket id', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare, reset
    vehicleSizeId = constant.VEHICLE_SIZE.MEDIUM
    plateNumber = 'abc-123'

    // prepare, create parking lot
    response = await request
      .post('/parking_lot')
      .send({ name: 'mall_1', rank: 1, nSlotsKey: { 1: 0, 2: 4, 3: 0 } })
    parkingLot = response.body.data

    // prepare, park a vehicle
    await request
      .post('/vehicle/park')
      .send({ vehicleSizeId, plateNumber, parkingLotId: parkingLot.id })

    // perform
    response = await request
      .post('/vehicle/exit')
      .send({
        ticketId: -1
      })
  })

  // // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.NOT_FOUND}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.NOT_FOUND)
  })
})

describe('POST /vehicle/exit with invalid parameter', () => {
  before(async () => {
    // reset
    await testHelper.reset

    // perform
    response = await request
      .post('/vehicle/exit')
      .send({
        'ticketId': 'four'
      })
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.UNPROCESSABLE_ENTITY}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.UNPROCESSABLE_ENTITY)
    assert.deepStrictEqual(response.body, {
      code: 422,
      data: [
        {
          message: '"ticketId" must be a number',
          path: [
            'ticketId'
          ],
          type: 'number.base',
          context: {
            value: 'four',
            key: 'ticketId',
            label: 'ticketId'
          }
        }
      ],
      message: ''
    })
  })
})
