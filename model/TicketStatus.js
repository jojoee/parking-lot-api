module.exports = function (sequelize, DataTypes) {
  const TicketStatus = sequelize.define('TicketStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'ticket_status',
    timestamps: false
  })

  return TicketStatus
}
