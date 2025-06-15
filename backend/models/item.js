'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.ConsumptionLog, {
        foreignKey: 'item_id',
        as: 'consumptionLogs',
      });
    }
  }
  Item.init({
    name: DataTypes.STRING,
    unit: DataTypes.STRING,
    current_quantity: DataTypes.FLOAT,
    reorder_threshold: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};