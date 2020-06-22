module.exports = function (sequelize, DataTypes) {
  const SlotSize = sequelize.define('SlotSize', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'slot_size',
    timestamps: false
  })

  return SlotSize
}
