module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create unique index slot_status_id_uindex on slot_status (id);
      `),
      queryInterface.sequelize.query(`
        create unique index slot_status_name_uindex on slot_status (name);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE slot_status DROP INDEX slot_status_id_uindex;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE slot_status DROP INDEX slot_status_name_uindex;
      `)
    ])
  }
}
