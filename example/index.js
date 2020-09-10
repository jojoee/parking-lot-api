const axios = require('axios')
console.log('start a example of client')

;(async () => {
  const config = {
    method: 'post',
    url: 'localhost:5005/parking_lot',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      'name': 'mall_floor14',
      'rank': 14,
      'nSlotsKey': { '1': 1, '2': 2, '3': 5 }
    })
  }

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
    })
    .catch(function (error) {
      console.log(error)
    })
})()
