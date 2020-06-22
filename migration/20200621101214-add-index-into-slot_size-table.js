module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create unique index slot_size_id_uindex on slot_size (id);
      `),
      queryInterface.sequelize.query(`
        create unique index slot_size_name_uindex on slot_size (name);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE slot_size DROP INDEX slot_size_id_uindex;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE slot_size DROP INDEX slot_size_name_uindex;
      `)
    ])
  }
}
