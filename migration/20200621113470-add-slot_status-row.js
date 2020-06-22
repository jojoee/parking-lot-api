module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('slot_status', [{
      id: 1,
      name: 'occupied'
    }, {
      id: 2,
      name: 'unoccupied'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('slot_status', { id: {
      [Sequelize.Op.in]: [1, 2] }
    }, {})
  }
}
