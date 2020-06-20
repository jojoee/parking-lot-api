const express = require('express')
const router = express.Router()
const { reply } = require('../module/util')

// home
router.get('/', (req, res) => reply(res, { message: 'hello' }))

module.exports = router
