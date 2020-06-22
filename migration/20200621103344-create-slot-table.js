module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create table slot
        (
          id int auto_increment,
          \`rank\` int not null,
          parking_lot_id int null,
          slot_size_id int null,
          slot_status_id int null,
          constraint slot_pk
            primary key (id),
          constraint slot_parking_lot_id_fk
            foreign key (parking_lot_id) references parking_lot (id),
          constraint slot_slot_size_id_fk
            foreign key (slot_size_id) references slot_size (id),
          constraint slot_slot_status_id_fk
            foreign key (slot_status_id) references slot_status (id)
        );
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE slot;
    `)
  }
}
