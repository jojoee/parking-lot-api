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
  orderRanksByNearestRank
}
