const Joi = require('joi')
const { reply } = require('../module/util')
const constant = require('../config/constant')

const validate = (key, schema) => (req, res, next) => {
  const result = Joi.validate(req[key], schema, {
    abortEarly: false
  })

  if (result.error) {
    // todo should not expose all details
    reply(res, {
      code: constant.HTTP_CODE.UNPROCESSABLE_ENTITY,
      data: result.error.details
    })
  } else {
    return next()
  }
}

module.exports = {
  validate
}
