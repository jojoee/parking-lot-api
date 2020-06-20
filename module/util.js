/**
 * Return response
 *
 * @param {Object} res
 */
function reply (res, { code = 200, data = null, message = '' }) {
  res.status(code)
  res.json({
    code,
    data,
    message
  })
}

module.exports = {
  reply
}
