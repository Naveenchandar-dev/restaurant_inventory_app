const { Item, ConsumptionLog, sequelize } = require('../../models');
const { getRestockPredictions } = require('../services/predictionService');

// POST /items
exports.addItem = async (req, res) => {
  try {
    const { name, unit, current_quantity, reorder_threshold } = req.body;
    const newItem = await Item.create({ name, unit, current_quantity, reorder_threshold });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Error adding item', error: error.message });
  }
};

// GET /items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({ order: [['name', 'ASC']] });
    const itemsWithStatus = items.map(item => {
      const itemJSON = item.toJSON();
      itemJSON.status = item.current_quantity <= item.reorder_threshold ? 'Low Stock' : 'In Stock';
      return itemJSON;
    });
    res.status(200).json(itemsWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// POST /consumption
exports.logConsumption = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { item_id, quantity, date } = req.body;
    
    const item = await Item.findByPk(item_id, { transaction: t });

    if (!item) {
      await t.rollback();
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.current_quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ message: 'Not enough stock to consume' });
    }

    // Decrement item quantity
    item.current_quantity -= quantity;
    await item.save({ transaction: t });

    // Create consumption log
    const log = await ConsumptionLog.create({ item_id, quantity, date }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Consumption logged successfully', log });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error logging consumption', error: error.message });
  }
};

// GET /restock-alerts
exports.getRestockAlerts = async (req, res) => {
  try {
    const alerts = await getRestockPredictions();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error generating restock alerts', error: error.message });
  }
};