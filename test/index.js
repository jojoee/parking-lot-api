require('dotenv').config({ path: '.env.test' })
const constant = require('../config/constant')
const supertest = require('supertest')
let request, server

before(() => {
  server = require('./../app')
  server.listen()
  request = supertest(server)
})

describe('GET /', () => {
  it('returns hello message', done => {
    request
      .get('/')
      .expect(constant.HTTP_CODE.OK, {
        code: constant.HTTP_CODE.OK,
        data: null,
        message: 'hello'
      }, done)
  })
})
