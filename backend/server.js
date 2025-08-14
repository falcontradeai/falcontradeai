const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize, WatchlistItem, NewsItem } = require('./models');

const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const rfqRoutes = require('./routes/rfqs');
const marketDataRoutes = require('./routes/marketData');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const watchlistRoutes = require('./routes/watchlist');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const stripeWebhook = require('./webhooks/stripe');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/market-data', marketDataRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('FalconTrade Backend is running');
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(async () => {
  if (await WatchlistItem.count() === 0) {
    await WatchlistItem.bulkCreate([
      { userId: 1, symbol: 'AAPL', price: 150 },
      { userId: 1, symbol: 'GOOGL', price: 2800 },
    ]);
  }
  if (await NewsItem.count() === 0) {
    await NewsItem.bulkCreate([
      {
        title: 'Welcome to FalconTrade',
        content: 'Stay tuned for updates',
        publishedAt: new Date(),
      },
      {
        title: 'Trading Tips',
        content: 'Remember to diversify your portfolio.',
        publishedAt: new Date(),
      },
    ]);
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
