module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('slot_size', [{
      id: 1,
      name: 'small'
    }, {
      id: 2,
      name: 'medium'
    }, {
      id: 3,
      name: 'large'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('slot_size', { id: {
      [Sequelize.Op.in]: [1, 2, 3] }
    }, {})
  }
}
