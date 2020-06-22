module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create unique index vehicle_size_id_uindex on vehicle_size (id);
      `),
      queryInterface.sequelize.query(`
        create unique index vehicle_size_name_uindex on vehicle_size (name);
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE vehicle_size DROP INDEX vehicle_size_id_uindex;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE vehicle_size DROP INDEX vehicle_size_name_uindex;
      `)
    ])
  }
}
