module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create table parking_lot_stack
        (
          id int auto_increment,
          parking_lot_id int not null,
          parking_lot_rank int not null,
          slot_size_id int not null,
          data text not null,
          constraint parking_lot_stack_pk
            primary key (id)
        );
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE parking_lot_stack;
    `)
  }
}
