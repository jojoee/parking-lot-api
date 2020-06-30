module.exports = function (sequelize, DataTypes) {
  const ParkingLot = sequelize.define('ParkingLot', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    rank: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
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
    tableName: 'parking_lot',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return ParkingLot
}
