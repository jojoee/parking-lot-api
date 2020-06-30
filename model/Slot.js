module.exports = function (sequelize, DataTypes) {
  const Slot = sequelize.define('Slot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rank: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    parking_lot_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ParkingLot',
        key: 'id'
      }
    },
    slot_size_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SlotSize',
        key: 'id'
      }
    },
    slot_status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SlotStatus',
        key: 'id'
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
    tableName: 'slot',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })

  return Slot
}
