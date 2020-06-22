const assert = require('assert')
const { orderRanksByNearestRank } = require('./util')

describe('mocha', () => {
  it('able to run', () => {
    assert.ok(true)
  })
})

describe('orderRanksByNearestRank', () => {
  it('returns the same cause entryRank is the lowest', () => {
    assert.deepStrictEqual(orderRanksByNearestRank(1, [1, 2, 3, 4, 5]), [1, 2, 3, 4, 5])
  })

  it('returns a reverse cause entryRank is the highest', () => {
    assert.deepStrictEqual(orderRanksByNearestRank(5, [1, 2, 3, 4, 5]), [5, 4, 3, 2, 1])
  })

  it('orders by nearest rank', () => {
    assert.deepStrictEqual(orderRanksByNearestRank(2, [1, 2, 3, 4, 5]), [2, 1, 3, 4, 5])
    assert.deepStrictEqual(orderRanksByNearestRank(3, [1, 2, 3, 4, 5]), [3, 2, 4, 1, 5])
    assert.deepStrictEqual(orderRanksByNearestRank(4, [1, 2, 3, 4, 5]), [4, 3, 5, 2, 1])
  })

  it('orders chipped ranks by nearest rank', () => {
    assert.deepStrictEqual(orderRanksByNearestRank(2, [1, 2, 4, 5]), [2, 1, 4, 5])
    assert.deepStrictEqual(orderRanksByNearestRank(3, [1, 3, 4, 5]), [3, 4, 1, 5])
    assert.deepStrictEqual(orderRanksByNearestRank(3, [1, 2, 3, 5]), [3, 2, 1, 5])
    assert.deepStrictEqual(orderRanksByNearestRank(4, [1, 2, 4, 5]), [4, 5, 2, 1])

    assert.deepStrictEqual(orderRanksByNearestRank(4, [1, 4, 5]), [4, 5, 1])
    assert.deepStrictEqual(orderRanksByNearestRank(2, [1, 2, 5]), [2, 1, 5])
  })
})
