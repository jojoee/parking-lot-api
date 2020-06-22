module.exports = function (sequelize, DataTypes) {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    plate_number: {
      type: DataTypes.STRING
    },
    vehicle_size_id: {
      type: DataTypes.STRING // todo small car can park in medium slot
    },
    slot_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Slot',
        key: 'id'
      }
    },
    ticket_status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TicketStatus',
        key: 'id'
      }
    },
    park_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    exit_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ticket',
    timestamps: false
  })

  return Ticket
}
