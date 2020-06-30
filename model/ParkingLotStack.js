module.exports = function (sequelize, DataTypes) {
  // this model will not have reference
  const ParkingLotStack = sequelize.define('ParkingLotStack', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parking_lot_id: DataTypes.INTEGER,
    parking_lot_rank: DataTypes.INTEGER,
    slot_size_id: DataTypes.INTEGER,
    data: DataTypes.STRING,
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
    tableName: 'parking_lot_stack',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return ParkingLotStack
}
