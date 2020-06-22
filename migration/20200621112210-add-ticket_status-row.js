module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ticket_status', [{
      id: 1,
      name: 'open'
    }, {
      id: 2,
      name: 'close'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ticket_status', { id: {
      [Sequelize.Op.in]: [1, 2] }
    }, {})
  }
}
