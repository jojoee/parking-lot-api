module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create table ticket
        (
          id int auto_increment,
          plate_number varchar(255) not null,
          vehicle_size_id int null,
          slot_id int null,
          ticket_status_id int null,
          park_at datetime default now() null,
          exit_at datetime default now() null,
          constraint ticket_pk
            primary key (id),
          constraint ticket_vehicle_size_id_fk
            foreign key (vehicle_size_id) references vehicle_size (id),
          constraint ticket_slot_id_fk
            foreign key (slot_id) references slot (id),
          constraint ticket_ticket_status_id_fk
            foreign key (ticket_status_id) references ticket_status (id)
        );
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE ticket;
    `)
  }
}
