require('dotenv').config({ path: '.env.test' })
const constant = require('../config/constant')
const supertest = require('supertest')
let request, server

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
})

describe('GET /404', () => {
  it('returns 404 response', done => {
    request
      .get('/404')
      .expect(constant.HTTP_CODE.NOT_FOUND, {
        code: constant.HTTP_CODE.NOT_FOUND,
        data: null,
        message: ''
      }, done)
  })
})
