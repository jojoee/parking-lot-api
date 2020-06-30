module.exports = function (sequelize, DataTypes) {
  const TicketStatus = sequelize.define('TicketStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'ticket_status',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return TicketStatus
}
