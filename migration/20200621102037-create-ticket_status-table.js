module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        create table ticket_status
        (
          id int not null,
          name varchar(255) not null
        );
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE ticket_status;
    `)
  }
}
