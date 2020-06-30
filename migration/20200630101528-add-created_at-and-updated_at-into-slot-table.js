module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE slot ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE slot ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
      `)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(`
        ALTER TABLE slot DROP COLUMN created_at;
      `),
      queryInterface.sequelize.query(`
        ALTER TABLE slot DROP COLUMN updated_at;
      `)
    ])
  }
}
