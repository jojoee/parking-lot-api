module.exports = function (sequelize, DataTypes) {
  const SlotStatus = sequelize.define('SlotStatus', {
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

  return SlotStatus
}
