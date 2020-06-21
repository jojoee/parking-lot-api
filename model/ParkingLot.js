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
    }
  }, {
    tableName: 'parking_lot',
    timestamps: false
  })

  return ParkingLot
}
