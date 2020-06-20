require('dotenv').config({ path: '.env.test' })
const constant = require('../config/constant')
const supertest = require('supertest')
let request, server, url

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
})

describe('/', () => {
  before(() => {
    url = '/'
  })

  it('returns hello message', done => {
    request
      .get(url)
      .expect(constant.HTTP_CODE_OK, {
        code: constant.HTTP_CODE_OK,
        data: null,
        message: 'hello'
      }, done)
  })
})
