const assert = require('assert')
const { getNearestAvailableParkingLotStack, orderRanksByNearestRank } = require('./util')

describe('mocha', () => {
  it('able to run', () => {
    assert.ok(true)
  })
})

describe('getNearestAvailableParkingLotRank', () => {
  it('returns current parking lot', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, [{
      parking_lot_rank: 1, data: '[]'
    }, {
      parking_lot_rank: 2, data: '[24]'
    }, {
      parking_lot_rank: 3, data: '[31,32]'
    }]), {
      parking_lot_rank: 2, data: '[24]'
    })
  })

  it('returns current parking lot (not provides data equals "[]")', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, [{
      parking_lot_rank: 2, data: '[24]'
    }, {
      parking_lot_rank: 3, data: '[31,32]'
    }]), {
      parking_lot_rank: 2, data: '[24]'
    })
  })

  it('returns nearest parking lot', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(1, [{
      parking_lot_rank: 1, data: '[]'
    }, {
      parking_lot_rank: 2, data: '[24]'
    }, {
      parking_lot_rank: 3, data: '[31,32]'
    }]), {
      parking_lot_rank: 2, data: '[24]'
    })

    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, [{
      parking_lot_rank: 1, data: '[11]'
    }, {
      parking_lot_rank: 2, data: '[]'
    }, {
      parking_lot_rank: 3, data: '[31,32]'
    }]), {
      parking_lot_rank: 1, data: '[11]'
    })
  })

  it('returns nearest parking lot (not provides data equals "[]")', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, [{
      parking_lot_rank: 1, data: '[11]'
    }, {
      parking_lot_rank: 3, data: '[31,32]'
    }]), {
      parking_lot_rank: 1, data: '[11]'
    })
  })

  it('returns -1 cause no available parking lot (no available slot)', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(1, [{
      parking_lot_rank: 1, data: '[]'
    }, {
      parking_lot_rank: 2, data: '[]'
    }]), null)

    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, [{
      parking_lot_rank: 1, data: '[]'
    }, {
      parking_lot_rank: 2, data: '[]'
    }]), null)
  })

  it('returns -1 cause no available parking lot (no available slot) (not provides data equals "[]")', () => {
    assert.deepStrictEqual(getNearestAvailableParkingLotStack(2, []), null)
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
