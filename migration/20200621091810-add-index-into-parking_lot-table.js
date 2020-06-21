module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create unique index parking_lot_name_uindex on parking_lot (name);
      `),
      queryInterface.sequelize.query(`
        create unique index parking_lot_rank_uindex on parking_lot (\`rank\`);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE parking_lot DROP INDEX parking_lot_name_uindex;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE parking_lot DROP INDEX parking_lot_rank_uindex;
      `)
    ])
  }
}
