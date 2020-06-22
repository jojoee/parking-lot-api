const express = require('express')
const router = express.Router()
const { reply } = require('../module/util')
const constant = require('../config/constant')
const parkingLotController = require('../controller/parkingLotController')

// home
router.get('/', (req, res) => reply(res, { message: 'hello' }))

// route
router.post('/parking_lot', parkingLotController.createParkingLot)
// 404
router.get('*', (req, res) => reply(res, { code: constant.HTTP_CODE.NOT_FOUND }))

module.exports = router
