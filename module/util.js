/**
 * Return response
 *
 * @param {Object} res
 */
function reply (res, { code = 200, data = null, message = '' }) {
  console.log(code)
  console.log(data)
  console.log(message)
  console.log(res)
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
