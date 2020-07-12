const express = require('express')
const router = express.Router()
const { reply } = require('../module/util')
const constant = require('../config/constant')
const parkingLotController = require('../controller/parkingLotController')
const vehicleController = require('../controller/vehicleController')
const ticketController = require('../controller/ticketController')
const Joi = require('joi')
const { validate } = require('../middleware')

// home
router.get('/', (req, res) => reply(res, { message: 'hello' }))
router.post('/parking_lot', validate('body', Joi.object().keys({
  name: Joi.string().required(),
  rank: Joi.number().integer(),
  // todo must be dynamic, nSlotsKey depends on "SLOT_SIZE"
  nSlotsKey: Joi.object().keys({
    '1': Joi.number().integer().min(0).required(),
    '2': Joi.number().integer().min(0).required(),
    '3': Joi.number().integer().min(0).required()
  }).required()
})), parkingLotController.createParkingLot)
router.get('/parking_lot/status', parkingLotController.getParkingLotStacks)
router.post('/vehicle/park', validate('body', Joi.object().keys({
  vehicleSizeId: Joi.number().integer().required(),
  plateNumber: Joi.string().required(),
  parkingLotId: Joi.number().integer().required()
})), vehicleController.park)
router.post('/vehicle/exit', validate('body', Joi.object().keys({
  ticketId: Joi.number().integer().required()
})), vehicleController.exit)
router.get('/ticket', validate('query', Joi.object().keys({
  vehicleSizeId: Joi.number().integer().min(0).required()
})), ticketController.getTickets)

// 404
router.get('*', (req, res) => reply(res, { code: constant.HTTP_CODE.NOT_FOUND }))

module.exports = router
