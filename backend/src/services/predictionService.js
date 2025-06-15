const { Op } = require('sequelize');
const { Item, ConsumptionLog } = require('../../models');

const getRestockPredictions = async () => {
  const items = await Item.findAll();
  const alerts = [];

  for (const item of items) {
    // Get consumption logs for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await ConsumptionLog.findAll({
      where: {
        item_id: item.id,
        date: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      order: [['date', 'ASC']],
    });

    if (logs.length < 2) {
      // Not enough data to predict
      continue;
    }
    
    const totalConsumption = logs.reduce((sum, log) => sum + log.quantity, 0);
    const firstDate = new Date(logs[0].date);
    const lastDate = new Date(logs[logs.length - 1].date);
    const diffTime = Math.abs(lastDate - firstDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

    const averageDailyConsumption = totalConsumption / diffDays;

    if (averageDailyConsumption <= 0) {
      continue;
    }

    const daysUntilEmpty = item.current_quantity / averageDailyConsumption;

    // Generate alert if stock will run out within 3 days
    if (daysUntilEmpty <= 3) {
      // Recommend reordering a 7-day supply
      const recommendedReorderQuantity = Math.ceil(averageDailyConsumption * 7);
      
      alerts.push({
        itemId: item.id,
        name: item.name,
        currentQuantity: item.current_quantity,
        unit: item.unit,
        daysUntilEmpty: parseFloat(daysUntilEmpty.toFixed(1)),
        recommendedReorderQuantity,
      });
    }
  }

  return alerts;
};

module.exports = { getRestockPredictions };