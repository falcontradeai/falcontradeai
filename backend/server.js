const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const rfqRoutes = require('./routes/rfqs');
const marketDataRoutes = require('./routes/marketData');
const messageRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/market-data', marketDataRoutes);
app.use('/api/v1/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('FalconTrade Backend is running');
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
