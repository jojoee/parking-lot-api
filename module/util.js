/**
 * Return response
 *
 * @param {Object} res
 * @param {Number} [param.code=200]
 * @param {any} [param.data=null]
 * @param {String} [param.message='']
 */
function reply (res, param) {
  const { code = 200, data = null, message = '' } = param
  res.status(code)
  res.json({
    code,
    data,
    message
  })
}

/**
 * Get nearest slot
 * nearest slot is based on slot rank and parking lot rank
 *
 * criteria
 * - find lowest rank slot in the same parking lot
 * - if not then, find the lowest rank slot in the nearest parking lot
 *   e.g. parkingLotEntryRank = 3, will find in parkingLotRank = 2 or 4 first and so on
 * - if no slot available then, will return null
 *
 * @param {Number} [parkingLotEntryRank=0] rank of parking lot's entry
 * @param {ParkingLotStacks} parkingLotStacks parkingLotStacks that's sorted by rank
 * @returns {ParkingLotStack} nearest available parkingLotStack
 */
function getNearestAvailableParkingLotStack (parkingLotEntryRank = 0, parkingLotStacks) {
  // sort ranks
  const ranks = parkingLotStacks.map(item => item.parking_lot_rank)
  const sortedRanks = orderRanksByNearestRank(parkingLotEntryRank, ranks)

  // change data structure from list to dict
  const parkingLotStackKey = {}
  for (const parkingLotStack of parkingLotStacks) {
    parkingLotStackKey[parkingLotStack.parking_lot_rank] = parkingLotStack
  }

  let nearestAvailableParkingLotStack = null
  for (const rank of sortedRanks) {
    if (parkingLotStackKey[rank].data !== '[]') {
      nearestAvailableParkingLotStack = parkingLotStackKey[rank]
      break
    }
  }

  return nearestAvailableParkingLotStack
}

/**
 * Order parking lot rank with entryRank by nearest rank
 *
 * @param {Number} entryRank
 * @param {Number[]} ranks list of parking lot rank that's sorted by asc
 * @returns {Number[]}
 */
function orderRanksByNearestRank (entryRank, ranks) {
  let sortedRanks = []
  if (entryRank === ranks[0]) {
    sortedRanks = [...ranks]
  } else if (entryRank === ranks[ranks.length - 1]) {
    sortedRanks = [...ranks]
    sortedRanks.reverse()
  } else {
    // calculate rank distance based on entry rank
    const distKey = {}
    for (let rank of ranks) {
      const dist = Math.abs(entryRank - rank)
      distKey[dist] = distKey[dist] ? distKey[dist].concat([rank]) : [rank]
    }

    // flatten it
    for (let dist in distKey) {
      sortedRanks = sortedRanks.concat(distKey[dist])
    }
  }

  return sortedRanks
}

module.exports = {
  reply,
  getNearestAvailableParkingLotStack,
  orderRanksByNearestRank
}
