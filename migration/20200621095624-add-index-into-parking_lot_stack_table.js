module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE parking_lot_stack ADD UNIQUE parking_lot_stack_unique(parking_lot_id, slot_size_id);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE parking_lot_stack DROP INDEX parking_lot_stack_unique;
      `)
    ])
  }
}
