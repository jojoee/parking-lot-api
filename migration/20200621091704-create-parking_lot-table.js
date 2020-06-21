module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create table parking_lot
        (
          id int auto_increment,
          name varchar(255) not null,
          \`rank\` int not null,
          constraint parking_lot_pk
            primary key (id)
        );
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE parking_lot;
    `)
  }
}
