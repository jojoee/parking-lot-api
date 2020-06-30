module.exports = function (sequelize, DataTypes) {
  const SlotSize = sequelize.define('SlotSize', {
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
    tableName: 'slot_size',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return SlotSize
}
