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
    slot_size_id: DataTypes.INTEGER, // no assign FK
    data: DataTypes.STRING
  }, {
    tableName: 'parking_lot_stack',
    timestamps: false
  })

  return ParkingLotStack
}
