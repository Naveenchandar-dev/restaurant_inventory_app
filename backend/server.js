require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const apiRoutes = require('./src/routes/api');
const { apiKeyAuth } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Apply API key authentication to all API routes
app.use('/api', apiKeyAuth, apiRoutes);

app.get('/', (req, res) => {
    res.send('Restaurant Inventory Tracker API is running.');
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});