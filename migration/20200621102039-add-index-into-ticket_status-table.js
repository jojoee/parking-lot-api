module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create unique index ticket_status_id_uindex on ticket_status (id);
      `),
      queryInterface.sequelize.query(`
        create unique index ticket_status_name_uindex on ticket_status (name);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE ticket_status DROP INDEX ticket_status_id_uindex;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE ticket_status DROP INDEX ticket_status_name_uindex;
      `)
    ])
  }
}
