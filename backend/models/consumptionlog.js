'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConsumptionLog extends Model {
    static associate(models) {
      ConsumptionLog.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }
  ConsumptionLog.init({
    item_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    quantity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ConsumptionLog',
  });
  return ConsumptionLog;
};