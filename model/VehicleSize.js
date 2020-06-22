module.exports = function (sequelize, DataTypes) {
  const VehicleSize = sequelize.define('VehicleSize', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'vehicle_size',
    timestamps: false
  })

  return VehicleSize
}
