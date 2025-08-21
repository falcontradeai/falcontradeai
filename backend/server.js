const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const { sequelize, WatchlistItem, NewsItem, User } = require('./models');
const { scheduleMarketDataRefresh } = require('./services/marketDataService');

const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const rfqRoutes = require('./routes/rfqs');
const marketDataRoutes = require('./routes/marketData');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const watchlistRoutes = require('./routes/watchlist');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const forecastRoutes = require('./routes/forecast');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const stripeWebhook = require('./webhooks/stripe');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/market-data', marketDataRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1/messages', messageRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/watchlist', watchlistRoutes);
  app.use('/api/v1/news', newsRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/contact', contactRoutes);
  app.use('/api/v1/content', contentRoutes);

app.get('/', (req, res) => {
  res.send('FalconTrade Backend is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(async () => {
  console.log('Database synced ✅');

  // Ensure default admin user exists
  const [user, created] = await User.findOrCreate({
    where: { id: 1 },
    defaults: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'dummyhash', // You can later replace with bcrypt hash
      role: 'admin',
      status: 'active',
      subscriptionStatus: 'inactive',
    },
  });

  if (created) {
    console.log('Default admin user created with id=1');
  } else {
    console.log('Admin user already exists');
  }

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

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  scheduleMarketDataRefresh();
});
