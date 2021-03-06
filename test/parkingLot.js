require('dotenv').config({ path: '.env.test' })
const assert = require('assert')
const constant = require('../config/constant')
const supertest = require('supertest')
const model = require('./../model')
const testHelper = require('./testHelper')
let request, server, db, response

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
  db = model.getConnections()
})

describe('POST /parking_lot to create parking lot', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // perform
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: {
          1: 1,
          2: 2,
          3: 3
        }
      })
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.CREATED}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.CREATED)
    assert.strictEqual(response.body.code, constant.HTTP_CODE.CREATED)
    assert.strictEqual(response.body.message, '')
    assert.strictEqual(response.body.data.name, 'mall_1')
    assert.strictEqual(response.body.data.rank, 1)
  })

  it('creates parkingLot record', async () => {
    const { dataValues: parkingLot } = await db.ParkingLot.findOne({ where: { name: 'mall_1' } })
    const target = {
      name: 'mall_1',
      rank: 1
    }
    for (const key in target) {
      assert.strictEqual(parkingLot[key], target[key])
    }
  })

  it('creates slot record', async () => {
    const smallSlots = await db.Slot.findAll({ where: {
      slot_size_id: 1
    } })
    assert.strictEqual(smallSlots.length, 1)

    const mediumSlots = await db.Slot.findAll({ where: {
      slot_size_id: 2
    } })
    assert.strictEqual(mediumSlots.length, 2)

    const largeSlots = await db.Slot.findAll({ where: {
      slot_size_id: 3
    } })
    assert.strictEqual(largeSlots.length, 3)
  })

  it('creates parkingSlotStack record', async () => {
    let slotModels = []
    let slotIds = []

    slotModels = await db.Slot.findAll({ where: { slot_size_id: 1 } })
    slotIds = slotModels.map(item => item.dataValues.id)
    const { dataValues: smallStack } = await db.ParkingLotStack.findOne({ where: {
      slot_size_id: 1
    } })
    assert.strictEqual(smallStack.data, JSON.stringify(slotIds))

    slotModels = await db.Slot.findAll({ where: { slot_size_id: 2 } })
    slotIds = slotModels.map(item => item.dataValues.id)
    const { dataValues: mediumStack } = await db.ParkingLotStack.findOne({ where: {
      slot_size_id: 2
    } })
    assert.strictEqual(mediumStack.data, JSON.stringify(slotIds))

    slotModels = await db.Slot.findAll({ where: { slot_size_id: 3 } })
    slotIds = slotModels.map(item => item.dataValues.id)
    const { dataValues: largeStack } = await db.ParkingLotStack.findOne({ where: {
      slot_size_id: 3
    } })
    assert.strictEqual(largeStack.data, JSON.stringify(slotIds))
  })
})

describe('POST /parking_lot to create parking lot with same name', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: {
          1: 1,
          2: 2,
          3: 3
        }
      })

    // perform
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 2,
        nSlotsKey: {
          1: 1,
          2: 2,
          3: 3
        }
      })
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.BAD_REQUEST}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.BAD_REQUEST)
    assert.deepStrictEqual(response.body, {
      code: constant.HTTP_CODE.BAD_REQUEST,
      data: null,
      message: ''
    })
  })
})

describe('POST /parking_lot to create parking lot with same rank', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // prepare
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_1',
        rank: 1,
        nSlotsKey: {
          1: 1,
          2: 2,
          3: 3
        }
      })

    // perform
    response = await request
      .post('/parking_lot')
      .send({
        name: 'mall_2',
        rank: 1,
        nSlotsKey: {
          1: 1,
          2: 2,
          3: 3
        }
      })
  })

  // todo move constant/hardcode to test/fixture
  it(`returns ${constant.HTTP_CODE.BAD_REQUEST}`, () => {
    // check response
    assert.strictEqual(response.status, constant.HTTP_CODE.BAD_REQUEST)
    assert.deepStrictEqual(response.body, {
      code: constant.HTTP_CODE.BAD_REQUEST,
      data: null,
      message: ''
    })
  })
})

describe('POST /parking_lot to create parking lot with invalid parameter', () => {
  before(async () => {
    // reset
    await testHelper.resetTestTables()

    // perform
    response = await request
      .post('/parking_lot')
      .send({
        name: 2020,
        rank: 'super rank',
        nSlotsKey: {
          1: 10,
          2: 'twelve',
          3: 'twenty'
        }
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
          message: '"name" must be a string',
          path: [
            'name'
          ],
          type: 'string.base',
          context: {
            value: 2020,
            key: 'name',
            label: 'name'
          }
        },
        {
          message: '"rank" must be a number',
          path: [
            'rank'
          ],
          type: 'number.base',
          context: {
            value: 'super rank',
            key: 'rank',
            label: 'rank'
          }
        },
        {
          message: '"2" must be a number',
          path: [
            'nSlotsKey',
            '2'
          ],
          type: 'number.base',
          context: {
            value: 'twelve',
            key: '2',
            label: '2'
          }
        },
        {
          message: '"3" must be a number',
          path: [
            'nSlotsKey',
            '3'
          ],
          type: 'number.base',
          context: {
            value: 'twenty',
            key: '3',
            label: '3'
          }
        }
      ],
      message: ''
    })
  })
})
